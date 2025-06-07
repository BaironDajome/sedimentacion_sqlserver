/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import OpenAI from 'openai';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

@Injectable()
export class GeojsoniaService {
  private openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

  constructor(
    @InjectDataSource() private dataSource: DataSource
  ) { }

  // Paso 1: Generar SQL a partir del lenguaje natural
  async generarSQL(queryTexto: string): Promise<string> {
    const prompt = `
    Tienes una base de datos PostgreSQL con PostGIS. La tabla se llama "geojson_data" y tiene una columna 'datos' de tipo JSONB.
    
    Además, la tabla tiene otras columnas como:
    - name
    - layer_id
    
    Tu objetivo es generar una consulta SQL **válida y sin explicaciones adicionales**, solo el contenido SQL, sin encabezados, sin comentarios ni texto extra.
    
    ➡ Reglas para construir la consulta:
    - Usa jsonb_array_elements(datos->'features') AS feat si necesitas acceder a los datos del array.
    - Para acceder a campos internos de los features:
       - Magnitud: feat->'properties'->>'magnitude'
       - Color: feat->'properties'->>'color'
       - Timestamp: feat->'properties'->>'timestamp'
       - Latitud: feat->'geometry'->'coordinates'->>1
       - Longitud: feat->'geometry'->'coordinates'->>0
    - Para obtener el 'geojson_id', accede con: datos->>'geojson_id'

    ⚠ IMPORTANTE:
    - No pongas funciones de agregación (AVG, MIN, MAX, COUNT, etc.) en el GROUP BY. ¡Jamás!
    - Solo agrupa por el alias resultante del width_bucket.
    - Si necesitas calcular valores agregados por rango, primero calcula el bucket y luego aplica las funciones agregadas agrupando SOLO por ese bucket.

        
    ✅ Ahora, genera la consulta para lo siguiente:
    "${queryTexto}"
    `;



    const completion = await this.openai.chat.completions.create({
      model: 'gpt-4',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0,
    });

    const sql = completion.choices[0].message?.content?.trim() ?? '';
    return sql;
  }

  // Paso 2: Ejecutar ese SQL directamente en la base de datos
  async generarYConsultar(queryTexto: string): Promise<any> {

    const sql = await this.generarSQL(queryTexto);
    // console.log('SQL generado:', sql);
    // Validación rápida (opcional)
    if (!sql.toLowerCase().startsWith('select')) {
      throw new Error('Consulta inválida o potencialmente peligrosa. Solo se permiten SELECT.');
    }

    // Ejecutar SQL directamente
    const result = await this.dataSource.query(sql);
    // console.log(result);

    const analisis = await this.analizarResultadoConIA(result, queryTexto);
    // Devolver tanto la consulta generada como los resultados
    return {
      result,
      analisis,
    };
  }


  // Paso 3: Método que envía los resultados a OpenAI para análisis
  async analizarResultadoConIA(result: any, queryTexto: string): Promise<string> {
    const promptAnalisis = `
    Has ejecutado una consulta SQL basada en esta petición del usuario: "${queryTexto}".

    Aquí están los resultados en formato JSON:
    ${JSON.stringify(result, null, 2)}

    Tu tarea es:
    - Dar un resumen claro en lenguaje natural de lo que representan los resultados.
    - Si hay tendencias, valores altos o bajos, anomalías o agrupaciones, menciónalos.
    - Sé breve, técnico pero entendible.

    Resumen:
    `;

    const completion = await this.openai.chat.completions.create({
      model: 'gpt-4',
      messages: [{ role: 'user', content: promptAnalisis }],
      temperature: 0.5,
    });

    const sql = completion.choices[0].message?.content?.trim() ?? '';
    return sql;
  }


}
