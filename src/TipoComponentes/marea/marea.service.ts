import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateMareaDto } from './dto/create-marea.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Marea } from './entities/marea.entity';
import { Repository } from 'typeorm';
import { cargaExcel, convertKeysToLowerCase, toTimestamp } from 'src/funciones/metodos-comunes.funciones';
import { CampaniadispositivoService } from 'src/campaniadispositivo/campaniadispositivo.service';
import { CreateCorrienteDto } from '../corriente/dto/create-corriente.dto';

@Injectable()
export class MareaService {
  constructor(
    @InjectRepository(Marea)
    private readonly mareaRepo: Repository<Marea>,
    private readonly cdService: CampaniadispositivoService,
  ) { }

  async createMultiple(dto: CreateCorrienteDto[]): Promise<{
    message: string;
    registros: number;
    noregistrados: { campania: string; dispositivo: string }[];
    erroresCount: number;
  }> {
    const registros: Marea[] = [];
    const noregistrados: { campania: string; dispositivo: string }[] = [];

    for (const fila of dto) {
      const cd = await this.cdService.findOne(fila.campania, fila.dispositivo);

      if (!cd) {
        noregistrados.push({ campania: fila.campania, dispositivo: fila.dispositivo });
      } else {
        const entidad = new Marea();
        entidad.hora = toTimestamp(fila.hora);
        entidad.altura = fila.direccion;
        entidad.cd = cd;
        registros.push(entidad);
      }
    }

    const savedRegistros = await this.mareaRepo.save(registros);

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
      const perfiles = cargaExcel(file, CreateMareaDto);// Carga los datos del archivo Excel
      const dataLowerCase = convertKeysToLowerCase(perfiles);// Convierte las claves de los datos a minúsculas
      return this.createMultiple(dataLowerCase);
    } catch (error) {
      // Manejo de errores
      console.error('Error al importar datos desde Excel:', error);
      throw new Error('Error interno al importar datos desde Excel');
    }
  }

  // Método para obtener un registro de Marea por su ID
  async findOneById(id: string): Promise<Marea> {
    // Busca el registro de Marea en la base de datos por ID
    const marea = await this.mareaRepo.findOne({ where: { id } });

    // Si no se encuentra el registro, lanza una excepción
    if (!marea) {
      throw new NotFoundException(`Marea con ID ${id} no encontrado`);
    }

    // Retorna el registro encontrado
    return marea;
  }



}
