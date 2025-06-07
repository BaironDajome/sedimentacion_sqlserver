import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateNivelmarDto } from './dto/create-nivelmar.dto';
import { NivelMar } from './entities/nivelmar.entity';
import { Repository } from 'typeorm/repository/Repository';
import { InjectRepository } from '@nestjs/typeorm';
import { calcularChunkSize, cargaExcel, convertKeysToLowerCase, toTimestamp } from 'src/funciones/metodos-comunes.funciones';
import { CampaniadispositivoService } from 'src/campaniadispositivo/campaniadispositivo.service';

@Injectable()
export class NivelmarService {
  constructor(
    @InjectRepository(NivelMar)
    private readonly nivelMarRepo: Repository<NivelMar>,
    private readonly cdService: CampaniadispositivoService,
  ) { }
  async createMultiple(dto: CreateNivelmarDto[]): Promise<{
    message: string;
    registros: number;
    noregistrados: { campania: string; dispositivo: string }[];
    erroresCount: number;
  }> {
    const registros: NivelMar[] = [];
    const noregistrados: { campania: string; dispositivo: string }[] = [];

    for (const fila of dto) {
      try {
        const cd = await this.cdService.findOne(fila.campania, fila.dispositivo);

        if (!cd || !fila.hora || fila.nivelmar === undefined || fila.nivelmar === null) {
          noregistrados.push({ campania: fila.campania, dispositivo: fila.dispositivo });
          continue;
        }

        const entidad = new NivelMar();
        entidad.hora = toTimestamp(fila.hora);
        entidad.nivelmar = fila.nivelmar;
        entidad.cd = cd;
        registros.push(entidad);

      } catch (error) {
        noregistrados.push({ campania: fila.campania, dispositivo: fila.dispositivo });
      }
    }

    if (registros.length === 0) {
      return {
        message: `No se registraron datos válidos.`,
        registros: 0,
        erroresCount: noregistrados.length,
        noregistrados,
      };
    }

    // Guardado por bloques (después del bucle)
    const CHUNK_SIZE = calcularChunkSize(4); // 3 campos: hora, nivelmar, cd
    let totalGuardados = 0;

    try {
      for (let i = 0; i < registros.length; i += CHUNK_SIZE) {
        const chunk = registros.slice(i, i + CHUNK_SIZE);
        const saved = await this.nivelMarRepo.save(chunk);
        totalGuardados += saved.length;
      }

      return {
        message: `${totalGuardados} registros cargados con éxito.`,
        registros: totalGuardados,
        erroresCount: noregistrados.length,
        noregistrados,
      };
    } catch (error) {
      console.error('Error al guardar registros:', error); // <--- Agrega esto
      throw new InternalServerErrorException('Error al guardar los registros en la base de datos');
    }

  }





  // Método para importar datos desde un archivo Excel para un componente específico
  async importar(file: Express.Multer.File) {
    try {
      const datos = cargaExcel(file, CreateNivelmarDto);// Carga los datos del archivo Excel
      const dataLowerCase = convertKeysToLowerCase(datos);// Convierte las claves de los datos a minúsculas     
      return this.createMultiple(dataLowerCase);
    } catch (error) {
      // Manejo de errores
      console.error('Error al importar datos desde Excel:', error);
      throw new Error('Error interno al importar datos desde Excel');
    }
  }



}
