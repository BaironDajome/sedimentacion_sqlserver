import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Oleaje } from './entities/oleaje.entity';
import { Repository } from 'typeorm';
import { CreateOleajeDto } from './dto/create-oleaje.dto';
import { cargaExcel, convertKeysToLowerCase, toTimestamp } from 'src/funciones/metodos-comunes.funciones';
import { CampaniadispositivoService } from 'src/campaniadispositivo/campaniadispositivo.service';

@Injectable()
export class OleajeService {
  constructor(
    @InjectRepository(Oleaje)
    private readonly oleajeRepo: Repository<Oleaje>,
    private readonly cdService: CampaniadispositivoService,
  ) { }

  async createMultiple(dto: CreateOleajeDto[]): Promise<{
    message: string;
    registros: number;
    noregistrados: { campania: string; dispositivo: string }[];
    erroresCount: number;
  }> {
    const registros: Oleaje[] = [];
    const noregistrados: { campania: string; dispositivo: string }[] = [];

    for (const fila of dto) {
      const cd = await this.cdService.findOne(fila.campania, fila.dispositivo);

      if (!cd) {
        noregistrados.push({ campania: fila.campania, dispositivo: fila.dispositivo });
      } else {
        const entidad = new Oleaje();
        entidad.hora = toTimestamp(fila.hora);
        entidad.altura_significativa = fila.altura_significativa;
        entidad.periodo_pico = fila.periodo_pico;
        entidad.direccion = fila.direccion;
        entidad.cd = cd;
        registros.push(entidad);
      }
    }

    const savedRegistros = await this.oleajeRepo.save(registros);

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
      const perfiles = cargaExcel(file, CreateOleajeDto);// Carga los datos del archivo Excel
      const dataLowerCase = convertKeysToLowerCase(perfiles);// Convierte las claves de los datos a minúsculas
      return this.createMultiple(dataLowerCase);
    } catch (error) {
      // Manejo de errores
      console.error('Error al importar datos desde Excel:', error);
      throw new Error('Error interno al importar datos desde Excel');
    }
  }



}
