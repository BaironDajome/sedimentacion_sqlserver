/* eslint-disable prettier/prettier */
import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCorrienteDto } from './dto/create-corriente.dto';
import { Corriente } from './entities/corriente.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { cargaExcel, convertKeysToLowerCase, toTimestamp } from 'src/funciones/metodos-comunes.funciones';
import { CampaniadispositivoService } from 'src/campaniadispositivo/campaniadispositivo.service';

@Injectable()
export class CorrienteService {
  constructor(
    @InjectRepository(Corriente)
    private readonly corrienteRepo: Repository<Corriente>,
    private readonly cdService: CampaniadispositivoService,
  ) { }

  async createMultiple(dto: CreateCorrienteDto[]): Promise<{
    message: string;
    registros: number;
    noregistrados: { campania: string; dispositivo: string }[];
    erroresCount: number;
  }> {
    const registros: Corriente[] = [];
    const noregistrados: { campania: string; dispositivo: string }[] = [];

    for (const fila of dto) {
      const cd = await this.cdService.findOne(fila.campania, fila.dispositivo);

      if (!cd) {
        noregistrados.push({ campania: fila.campania, dispositivo: fila.dispositivo });
      } else {
        const entidad = new Corriente();
        entidad.hora = toTimestamp(fila.hora);
        entidad.direccion = fila.direccion;
        entidad.profundidad = fila.profundidad;
        entidad.velocidad = fila.velocidad;
        entidad.cd = cd;
        registros.push(entidad);
      }
    }

    const savedRegistros = await this.corrienteRepo.save(registros);

    return {
      message: `${savedRegistros.length} registros cargados con éxito.`,
      registros: savedRegistros.length,
      erroresCount: noregistrados.length,
      noregistrados,
    };
  }

  // Método para importar datos desde un archivo Excel para un componente específico
  async importar(file: Express.Multer.File) {
    try {
      const datos = cargaExcel(file, CreateCorrienteDto);// Carga los datos del archivo Excel
      const dataLowerCase = convertKeysToLowerCase(datos);// Convierte las claves de los datos a minúsculas
      return this.createMultiple(dataLowerCase);
    } catch (error) {
      // Manejo de errores
      console.error('Error al importar datos desde Excel:', error);
      throw new Error('Error interno al importar datos desde Excel');
    }
  }

  // Método para obtener un registro de Corriente por su ID
  async findOneById(id: string): Promise<Corriente> {
    // Busca el registro de Corriente en la base de datos por ID
    const corrente = await this.corrienteRepo.findOne({ where: { id } });

    // Si no se encuentra el registro, lanza una excepción
    if (!corrente) {
      throw new NotFoundException(`Corriente con ID ${id} no encontrado`);
    }

    // Retorna el registro encontrado
    return corrente;
  }


}
