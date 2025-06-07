// src/campania/campania.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Campania } from './entities/campania.entity';
import { CreateCampaniaDto } from './dto/create-campania.dto';
import { DispositivoService } from 'src/dispositivo/dispositivo.service';
import { CampaniaDispositivo } from 'src/campaniadispositivo/entities/campaniadispositivo.entity';
import { cargaExcel, convertirStringFechaADate, convertKeysToLowerCase, limpiarString, parsearFecha, parseEpoca, validarFecha } from 'src/funciones/metodos-comunes.funciones';

@Injectable()
export class CampaniaService {
  constructor(
    @InjectRepository(Campania)
    private readonly campaniaRepo: Repository<Campania>,

    @InjectRepository(CampaniaDispositivo)
    private readonly campaniaDispositivoRepo: Repository<CampaniaDispositivo>,

    private readonly dispositivoService: DispositivoService,
  ) { }

  async createMultiple(dto: CreateCampaniaDto[]): Promise<{
    message: string;
    registros: number;
    noregistrados: { campania: string; dispositivo: string }[];
    erroresCount: number;
  }> {
    const registros: Campania[] = [];
    const noregistrados: { campania: string; dispositivo: string }[] = [];

    for (const fila of dto) {
      try {
        const dato = this.transformarFila(fila);

        // Validar nombre campaña
        const nombreCampania = limpiarString(dato.nombre);
        if (!nombreCampania) {
          noregistrados.push({ campania: fila.nombre || 'N/A', dispositivo: 'NOMBRE CAMPAÑA INVÁLIDO' });
          continue;
        }

        // Verificar existencia de campaña por nombre
        let campania = await this.existenciaCampaniaByNombre(nombreCampania);


        // Si no existe, crearla
        if (!campania) {
          const campaniaValida = await this.validarCampania(dato);

          if (!campaniaValida) {
            noregistrados.push({ campania: nombreCampania, dispositivo: 'DATOS INCOMPLETOS O INVÁLIDOS' });
            continue;
          }

          campania = this.campaniaRepo.create({
            nombre: campaniaValida.nombre,
            descripcion: campaniaValida.descripcion,
            fecha: campaniaValida.fecha,
            epoca: campaniaValida.epoca,
          });

          await this.campaniaRepo.save(campania);
        }

        registros.push(campania);

        // Iterar sobre dispositivos asociados
        if (Array.isArray(dato.dispositivos)) {
          for (const dispositivoItem of dato.dispositivos) {
            try {
              const dispositivoNombre = limpiarString(dispositivoItem.nombre);
              if (!dispositivoNombre) {
                noregistrados.push({ campania: nombreCampania, dispositivo: 'NOMBRE DISPOSITIVO INVÁLIDO' });
                continue;
              }

              const cd = await this.findOneCampaniaDispositivo(campania.nombre, dispositivoNombre);

              if (cd) {
                // Actualizar tipos sin duplicados
                cd.tiposArray = Array.from(
                  new Set([
                    ...(cd.tiposArray || []),
                    ...(dispositivoItem.tipos || [])
                  ])
                );

                await this.campaniaDispositivoRepo.save(cd);
              }
              else {
                // Verificar existencia del dispositivo
                const dispositivo = await this.dispositivoService.findOneByNombre(dispositivoNombre);

                if (!dispositivo) {
                  noregistrados.push({ campania: nombreCampania, dispositivo: dispositivoNombre });
                  continue;
                }

                // Crear nueva relación campaña-dispositivo
                const campaniaDispositivo = new CampaniaDispositivo();
                campaniaDispositivo.campania = campania;
                campaniaDispositivo.dispositivo = dispositivo;
                campaniaDispositivo.tiposArray = dispositivoItem.tipos || [];

                await this.campaniaDispositivoRepo.save(campaniaDispositivo);
              }
            } catch (error) {
              console.error(`Error con dispositivo ${dispositivoItem.nombre} de campaña ${nombreCampania}:`, error);
              noregistrados.push({ campania: nombreCampania, dispositivo: dispositivoItem.nombre || 'NOMBRE INVÁLIDO' });
            }
          }
        } else {
          noregistrados.push({ campania: nombreCampania, dispositivo: 'DISPOSITIVOS NO ES ARRAY' });
          continue;
        }

      } catch (error) {
        console.error(`Error al procesar campaña ${fila.nombre || 'N/A'}:`, error);
        noregistrados.push({ campania: fila.nombre || 'N/A', dispositivo: 'ERROR GENERAL' });
      }
    }

    return {
      message: `${registros.length} campañas creadas con éxito.`,
      registros: registros.length,
      erroresCount: noregistrados.length,
      noregistrados,
    };
  }

  async findOneById(id: string): Promise<Campania> {// Busca un puerto por su ID único y lanza una excepción si no lo encuentra
    const campania = await this.campaniaRepo.findOne({ where: { id } });

    if (!campania) {
      throw new NotFoundException(`Campania con ID ${id} no encontrado`);
    }
    return campania;
  }

  async findOneByNombre(nombre: string): Promise<Campania> {// Busca una campaña por su nombre único y lanza una excepción si no lo encuentra
    const campania = await this.campaniaRepo.findOne({ where: { nombre } });

    if (!campania) {
      throw new NotFoundException(`Campania con nombre ${nombre} no encontrado`);
    }
    return campania;
  }

  async findAll() {
    return await this.campaniaRepo.find();
  }

  // Método para importar datos desde un archivo Excel para un componente específico
  async importar(file: Express.Multer.File) {
    try {
      const datos = cargaExcel(file, CreateCampaniaDto);// Carga los datos del archivo Excel
      const dataLowerCase = convertKeysToLowerCase(datos);// Convierte las claves de los datos a minúsculas

      return this.createMultiple(dataLowerCase);
    } catch (error) {
      // Manejo de errores
      console.error('Error al importar datos desde Excel:', error);
      throw new Error('Error interno al importar datos desde Excel');
    }
  }

  async existenciaCampaniaByNombre(nombre: string): Promise<Campania | null> {// Busca una campaña por su nombre único y lanza una excepción si no lo encuentra
    const campania = await this.campaniaRepo.findOne({ where: { nombre } });
    return campania;
  }

  transformarFila(fila: any) {
    const tipos = fila.tipo.split(',').map((t: string) => t.trim());
    const dispositivos = fila.dispositivo.split(',').map((nombre: string) => ({
      nombre: nombre.trim(),
      tipos,
    }));

    return {
      nombre: fila.nombre,
      descripcion: fila.descripcion,
      fecha: convertirStringFechaADate(fila.fecha), // Asegúrate de tener esta función definida
      epoca: fila.epoca,
      dispositivos,
    };
  }

  async findOneCampaniaDispositivo(campaniaNombre: string, dispositivoNombre: string): Promise<CampaniaDispositivo | null> {
    const cd = await this.campaniaDispositivoRepo
      .createQueryBuilder('cd')
      .innerJoinAndSelect('cd.campania', 'campania')
      .innerJoinAndSelect('cd.dispositivo', 'dispositivo')
      .where('campania.nombre = :campaniaNombre', { campaniaNombre })
      .andWhere('dispositivo.nombre = :dispositivoNombre', { dispositivoNombre })
      .getOne();

    return cd ?? null;
  }

  async validarCampania(fila: any) {
    const nombre = limpiarString(fila.nombre);
    const descripcion = limpiarString(fila.descripcion);
    const fecha = parsearFecha(fila.fecha);
    const epoca = parseEpoca(fila.epoca);

    if (!nombre && !descripcion && !fecha && epoca) {
      return null;
    }

    return {
      nombre,
      descripcion,
      fecha,
      epoca,
    };
  }
}



