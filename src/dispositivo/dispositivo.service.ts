import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateDispositivoDto } from './dto/create-dispositivo.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Dispositivo } from './entities/dispositivo.entity';
import { Repository } from 'typeorm';
import { PuertosService } from 'src/puertos/puertos.service';
import { cargaExcel, convertKeysToLowerCase, toNumber } from 'src/funciones/metodos-comunes.funciones';
import { PuertoEnum } from 'src/enums/puerto.enum';


@Injectable()
export class DispositivoService {
  constructor(
    @InjectRepository(Dispositivo)
    private readonly dispositivoRepo: Repository<Dispositivo>,
    private readonly puertosService: PuertosService,

  ) { }

  async create(dto: CreateDispositivoDto) {
    const puerto = await this.puertosService.findOneName(dto.puerto);
    if (!puerto) {
      throw new NotFoundException(`Puerto con nombre ${dto.puerto} no encontrado`);
    }

    const lat = Number(dto.latitud);
    const lon = Number(dto.longitud);
    if (isNaN(lat) || isNaN(lon)) {
      throw new BadRequestException('Coordenadas inválidas');
    }

    const dispositivo = this.dispositivoRepo.create({
      ...dto,
      localizacion: `POINT(${lon} ${lat})`, // formato WKT para SQL Server geography
      puerto,
    });

    return await this.dispositivoRepo.save(dispositivo);
  }


  // async createMultiple(dtoList: CreateDispositivoDto[]): Promise<{ message: string; registros: number }> {
  //   const dispositivos: Dispositivo[] = [];

  //   function sanitizeString(value: any): string | null {
  //     if (value === undefined || value === null) return null;
  //     if (typeof value === 'string') return value.trim();
  //     if (typeof value.toString === 'function') return value.toString().trim();
  //     return null;
  //   }

  //   for (const fila of dtoList) {
  //     // Validar y obtener el puerto
  //     const puertoEnum: PuertoEnum = fila.puerto;
  //     const puerto = await this.puertosService.findOneName(puertoEnum);
  //     if (!puerto) {
  //       console.warn(`Puerto no encontrado para: ${puertoEnum}, fila ignorada.`);
  //       continue;
  //     }

  //     // Validar coordenadas numéricas
  //     const lat = Number(fila.latitud);
  //     const lon = Number(fila.longitud);
  //     if (isNaN(lat) || isNaN(lon)) {
  //       console.warn(`Coordenadas inválidas (lat: ${fila.latitud}, lon: ${fila.longitud}), fila ignorada.`);
  //       continue;
  //     }

  //     // Sanitizar strings y validar obligatorio 'nombre'
  //     const nombre = sanitizeString(fila.nombre);
  //     if (!nombre) {
  //       console.warn('Nombre inválido o vacío, fila ignorada.');
  //       continue;
  //     }
  //     const descripcion = sanitizeString(fila.descripcion) ?? '';

  //     // Crear la entidad Dispositivo con WKT para geography
  //     const dispositivo = this.dispositivoRepo.create({
  //       puerto, // asignamos el objeto completo
  //       localizacion: `POINT(${lon} ${lat})`, // WKT para SQL Server geography
  //       nombre,
  //       descripcion,
  //     });

  //     dispositivos.push(dispositivo);
  //   }

  //   if (dispositivos.length === 0) {
  //     return {
  //       message: 'No se encontraron registros válidos para guardar.',
  //       registros: 0,
  //     };
  //   }

  //   // Log para depuración
  //   console.log('Dispositivos a guardar:', dispositivos);

  //   // Guardar en BD
  //   const savedRegistros = await this.dispositivoRepo.save(dispositivos);

  //   return {
  //     message: `${savedRegistros.length} registros cargados con éxito.`,
  //     registros: savedRegistros.length,
  //   };
  // }


  async createMultiple(dtoList: CreateDispositivoDto[]): Promise<{ message: string; registros: number }> {
    let count = 0;

    for (const fila of dtoList) {
      const puertoEnum: PuertoEnum = fila.puerto;
      const puerto = await this.puertosService.findOneName(puertoEnum);
      if (!puerto) continue;

      const lat = toNumber(fila.latitud);
      const lon = toNumber(fila.longitud);

      if (isNaN(lat) || isNaN(lon)) {
        console.warn(`Coordenadas inválidas (lat: ${fila.latitud}, lon: ${fila.longitud}), fila ignorada.`);
        continue;
      }

      const nombre = fila.nombre?.trim();
      if (!nombre) continue;

      const descripcion = fila.descripcion?.trim() ?? '';

      const wkt = `POINT(${lon} ${lat})`;

      await this.dispositivoRepo.query(
        `INSERT INTO dispositivos (id, nombre, descripcion, localizacion, puerto_id)
        VALUES (NEWID(), @0, @1, geography::STGeomFromText(@2, 4326), @3)`,
        [nombre, descripcion, wkt, puerto.id]
      );

      count++;
    }

    return {
      message: `${count} registros cargados con éxito.`,
      registros: count,
    };
  }


  // Método para importar datos desde un archivo Excel para un componente específico
  async importar(file: Express.Multer.File) {
    try {
      const datos = cargaExcel(file, CreateDispositivoDto);

      // Limpia los datos: transforma claves a minúsculas y limpia valores null/undefined
      const dataLowerCase = convertKeysToLowerCase(datos).map(obj => {
        const cleaned = {};
        for (const key in obj) {
          cleaned[key] = obj[key] == null ? '' : obj[key];
        }
        return cleaned;
      });

      return this.createMultiple(dataLowerCase);
    } catch (error) {
      console.error('Error al importar datos desde Excel:', error);
      throw new Error('Error interno al importar datos desde Excel');
    }
  }


  async findAll(): Promise<Dispositivo[]> {
    return this.dispositivoRepo.find({
      relations: ['puerto', 'campanias', 'campanias.dato', 'campanias.dato.componentes'],
    });
  }

  async findOneByNombre(nombre: string): Promise<Dispositivo> {
    const dispositivo = await this.dispositivoRepo.findOne({ where: { nombre } });

    if (!dispositivo) {
      throw new NotFoundException(`Dispositivo con nombre "${nombre}" no encontrado`);
    }

    return dispositivo;
  }

  async findOneById(id: string): Promise<Dispositivo> {// Busca un dispocitivo por su ID único y lanza una excepción si no lo encuentra
    const dispositivo = await this.dispositivoRepo.findOne({ where: { id } });

    if (!dispositivo) {
      throw new NotFoundException(`Dispositivo con ID ${id} no encontrado`);
    }
    return dispositivo;
  }

  async listaDispositivos(): Promise<Dispositivo[]> {
    return this.dispositivoRepo.find();
  }


}


