import { CampaniadispositivoService } from './../../campaniadispositivo/campaniadispositivo.service';
import { Injectable } from '@nestjs/common';
import { CreatePerfilCtdDto } from './dto/create-perfil-ctd.dto';
import { PerfilCtd } from './entities/perfil-ctd.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { calcularChunkSize, cargaExcel, convertKeysToLowerCase, toTimestamp } from 'src/funciones/metodos-comunes.funciones';

@Injectable()
export class PerfilCtdService {
  [x: string]: any;
  constructor(
    @InjectRepository(PerfilCtd)
    private readonly perfilCtdRepo: Repository<PerfilCtd>,
    private readonly cdService: CampaniadispositivoService,
  ) { }

  async createMultiple(dto: CreatePerfilCtdDto[]): Promise<{
    message: string;
    registros: number;
    noregistrados: { campania: string; dispositivo: string }[];
    erroresCount: number;
  }> {
    const registros: PerfilCtd[] = [];
    const noregistrados: { campania: string; dispositivo: string }[] = [];

    // Cargar relaciones con CampaniaDispositivo
    for (const fila of dto) {
      const cd = await this.cdService.findOne(fila.campania, fila.dispositivo);
      if (!cd) {
        noregistrados.push({ campania: fila.campania, dispositivo: fila.dispositivo });
        continue;
      }

      const entidad = new PerfilCtd();
      entidad.hora = toTimestamp(fila.hora);
      entidad.temperatura = fila.temperatura;
      entidad.profundidad = fila.profundidad;
      entidad.salinidad = fila.salinidad;
      entidad.cd = cd;

      registros.push(entidad);
    }

    // SQL Server admite máximo 2100 parámetros por consulta.
    // Si tienes 5 campos por registro, usa bloques de 400 como máximo.

    const CHUNK_SIZE = calcularChunkSize(5);
    let totalGuardados = 0;

    for (let i = 0; i < registros.length; i += CHUNK_SIZE) {
      const chunk = registros.slice(i, i + CHUNK_SIZE);
      const saved = await this.perfilCtdRepo.save(chunk);
      totalGuardados += saved.length;
    }

    return {
      message: `${totalGuardados} registros cargados con éxito.`,
      registros: totalGuardados,
      erroresCount: noregistrados.length,
      noregistrados,
    };
  }

  // Método para importar datos desde un archivo Excel para un componente específico
  async importar(file: Express.Multer.File) {
    try {
      const datos = cargaExcel(file, CreatePerfilCtdDto);// Carga los datos del archivo Excel
      const dataLowerCase = convertKeysToLowerCase(datos);// Convierte las claves de los datos a minúsculas
      return this.createMultiple(dataLowerCase);
    } catch (error) {
      // Manejo de errores
      console.error('Error al importar datos desde Excel:', error);
      throw new Error('Error interno al importar datos desde Excel');
    }
  }



}


