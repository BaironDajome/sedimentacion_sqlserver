import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateSedimentoDto } from './dto/create-sedimento.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Sedimento } from './entities/sedimento.entity';
import { Repository } from 'typeorm';
import { cargaExcel, convertKeysToLowerCase, toTimestamp } from 'src/funciones/metodos-comunes.funciones';
import { CampaniadispositivoService } from 'src/campaniadispositivo/campaniadispositivo.service';

@Injectable()
export class SedimentoService {
  constructor(
    @InjectRepository(Sedimento)
    private readonly sedimentoRepo: Repository<Sedimento>,
    private readonly cdService: CampaniadispositivoService,
  ) { }

  async createMultiple(dto: CreateSedimentoDto[]): Promise<{
    message: string;
    registros: number;
    noregistrados: { campania: string; dispositivo: string }[];
    erroresCount: number;
  }> {
    const registros: Sedimento[] = [];
    const noregistrados: { campania: string; dispositivo: string }[] = [];

    for (const fila of dto) {
      const cd = await this.cdService.findOne(fila.campania, fila.dispositivo);

      if (!cd) {
        noregistrados.push({ campania: fila.campania, dispositivo: fila.dispositivo });
      } else {
        const entidad = new Sedimento();
        entidad.hora = toTimestamp(fila.hora);
        entidad.profundidad = fila.profundidad;
        entidad.salinidad = fila.salinidad;
        entidad.temperatura = fila.temperatura;
        entidad.cd = cd;
        registros.push(entidad);
      }
    }

    const savedRegistros = await this.sedimentoRepo.save(registros);

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
      const datos = cargaExcel(file, CreateSedimentoDto);// Carga los datos del archivo Excel
      const dataLowerCase = convertKeysToLowerCase(datos);// Convierte las claves de los datos a minúsculas
      return this.createMultiple(dataLowerCase);
    } catch (error) {
      // Manejo de errores
      console.error('Error al importar datos desde Excel:', error);
      throw new Error('Error interno al importar datos desde Excel');
    }
  }

  // Método para obtener un registro de Sedimento por su ID
  async findOneById(id: string): Promise<Sedimento> {
    // Busca el registro de Sedimento en la base de datos por ID
    const sedimento = await this.sedimentoRepo.findOne({ where: { id } });

    // Si no se encuentra el registro, lanza una excepción
    if (!sedimento) {
      throw new NotFoundException(`Sedimento con ID ${id} no encontrado`);
    }

    // Retorna el registro encontrado
    return sedimento;
  }



}
