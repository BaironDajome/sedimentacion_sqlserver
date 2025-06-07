import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Corriente } from 'src/TipoComponentes/corriente/entities/corriente.entity';
import { Dispositivo } from 'src/dispositivo/entities/dispositivo.entity';
import { Marea } from 'src/TipoComponentes/marea/entities/marea.entity';
import { NivelMar } from 'src/TipoComponentes/nivelmar/entities/nivelmar.entity';
import { Oleaje } from 'src/TipoComponentes/oleaje/entities/oleaje.entity';
import { PerfilCtd } from 'src/TipoComponentes/perfil-ctd/entities/perfil-ctd.entity';
import { Sedimento } from 'src/TipoComponentes/sedimento/entities/sedimento.entity';
import { Repository } from 'typeorm';
import { isUUID } from 'class-validator';
import { ComponenteEnum } from 'src/enums/tipo-componente.enum';
import { ObtenerPuertoProfundidadDto } from './dto/consulta-puerto-produndidad.dto';

@Injectable()
export class ConsultaService {

  constructor(
    @InjectRepository(Dispositivo)
    private readonly dispositivoRepo: Repository<Dispositivo>,

    @InjectRepository(PerfilCtd)
    private readonly perfilRepo: Repository<PerfilCtd>,

    @InjectRepository(NivelMar)
    private readonly nivelmarRepo: Repository<NivelMar>,

    @InjectRepository(Oleaje)
    private readonly oleajeRepo: Repository<Oleaje>,

    @InjectRepository(Corriente)
    private readonly corrienteRepo: Repository<Corriente>,

    @InjectRepository(Marea)
    private readonly mareaRepo: Repository<Marea>,

    @InjectRepository(Sedimento)
    private readonly sedimentoRepo: Repository<Sedimento>,

  ) { }

  formatPerfilCtdProdundadia(datos: PerfilCtd[]) {
    return datos.map(d => ({
      temperatura: d.temperatura,
      salinidad: d.salinidad,
    }));
  }
  formatPerfilCtd(datos: PerfilCtd[]) {
    return datos.map(d => ({
      hora: d.hora.toISOString(),   // Formato ISO string
      temperatura: d.temperatura,
      profundidad: d.profundidad,
      salinidad: d.salinidad,
    }));
  }
  formatCorriente(datos: Corriente[]) {
    return datos.map(d => ({
      hora: d.hora.toISOString(),
      velocidad: d.velocidad,
      dereccion: d.direccion,
      profundidad: d.profundidad,
    }));
  }
  formatMarea(datos: Marea[]) {
    return datos.map(d => ({
      hora: d.hora.toISOString(),
      altura: d.altura
    }));
  }
  formatNivelmar(datos: NivelMar[]) {
    return datos.map(d => ({
      hora: d.hora.toISOString(),
      altura_significativa: d.nivelmar
    }));
  }
  formatSedimento(datos: Sedimento[]) {
    return datos.map(d => ({
      hora: d.hora.toISOString(),
      profundidad: d.profundidad,
      salinidad: d.salinidad,
      temperatura: d.temperatura,
    }));
  }
  formatOleaje(datos: Oleaje[]) {
    return datos.map(o => ({
      hora: o.hora.toISOString(),
      altura_significativa: o.altura_significativa,
      periperiodo_picoodoOla: o.periodo_pico,
      direccion: o.direccion,
    }));
  }

  async getDispositivoDetalle(param: string) {
    let dispositivo: Dispositivo | null;

    if (isUUID(param)) {
      dispositivo = await this.dispositivoRepo.findOne({
        where: { id: param },
        relations: ['puerto', 'campaniasDispositivos', 'campaniasDispositivos.campania'],
      });
    }
    else {
      dispositivo = await this.dispositivoRepo.findOne({
        where: { nombre: param },
        relations: ['puerto', 'campaniasDispositivos', 'campaniasDispositivos.campania'],
      });
    }

    if (!dispositivo) {
      return {
        success: false,
        message: 'No se encontraron dispositivos.',
        data: [],
      };
    }

    const campaniasObj: Record<string, any> = {};

    // 2. Por cada campaña traer datos por componente en consultas separadas
    for (const cd of dispositivo.campaniasDispositivos) {
      const campania = cd.campania;
      const datos: Record<string, any[]> = {};

      // Consultas independientes para cada componente
      if (cd.tipos.includes(ComponenteEnum.OLEAJE)) {
        const oleajes = await this.oleajeRepo.find({ where: { cd: { id: cd.id } } });
        datos['oleaje'] = this.formatOleaje(oleajes);
      }

      if (cd.tipos.includes(ComponenteEnum.PERFILESCTD)) {
        const perfilctds = await this.perfilRepo.find({ where: { cd: { id: cd.id } } });
        datos['perfilctd'] = this.formatPerfilCtd(perfilctds);
      }

      if (cd.tipos.includes(ComponenteEnum.CORRIENTE)) {
        const corrientes = await this.corrienteRepo.find({ where: { cd: { id: cd.id } } });
        datos['corriente'] = this.formatCorriente(corrientes);
      }

      if (cd.tipos.includes(ComponenteEnum.MAREA)) {
        const mareas = await this.mareaRepo.find({ where: { cd: { id: cd.id } } });
        datos['marea'] = this.formatMarea(mareas);
      }

      if (cd.tipos.includes(ComponenteEnum.NIVEL_MAR)) {
        const nivelmares = await this.nivelmarRepo.find({ where: { cd: { id: cd.id } } });
        datos['nivelmar'] = this.formatNivelmar(nivelmares);
      }

      if (cd.tipos.includes(ComponenteEnum.SEDIMENTO)) {
        const sedimentos = await this.sedimentoRepo.find({ where: { cd: { id: cd.id } } });
        datos['sedimento'] = this.formatSedimento(sedimentos);
      }

      // 3. Armar la estructura de campaña
      campaniasObj[campania.nombre] = {
        id: campania.id,
        nombre: campania.nombre,
        fecha: campania.fecha,
        epoca: campania.epoca,
        componentes: cd.tipos,
        datos,
      };
    }

    return {
      id: dispositivo.id,
      nombre: dispositivo.nombre,
      puerto: {
        id: dispositivo.puerto.id,
        name: dispositivo.puerto.name,
      },
      campanias: campaniasObj,
    };
  }

  async getDispositivoCompletos() {
    const dispositivos = await this.dispositivoRepo.find({
      relations: ['puerto', 'campaniasDispositivos', 'campaniasDispositivos.campania'],
    });

    if (!dispositivos || dispositivos.length === 0) return [];

    const resultado: Array<{
      id: string;
      nombre: string;
      descripcion: string;
      puerto: { id: string; name: string };
      campanias: Record<
        string,
        {
          id: string;
          nombre: string;
          descripcion: string;
          fecha: Date; 
          epoca: string;
          componentes: ComponenteEnum[];
          datos: Record<string, any[]>;
        }
      >;
    }> = [];

    for (const dispositivo of dispositivos) {
      const campaniasObj: Record<string, any> = {};

      for (const cd of dispositivo.campaniasDispositivos) {
        const campania = cd.campania;
        const datos: Record<string, any[]> = {};

        if (cd.tipos.includes(ComponenteEnum.PERFILESCTD)) {
          const perfilctds = await this.perfilRepo.find({ where: { cd: { id: cd.id } } });
          datos['perfilctd'] = this.formatPerfilCtd(perfilctds);
        }
        if (cd.tipos.includes(ComponenteEnum.NIVEL_MAR)) {
          const nivelmares = await this.nivelmarRepo.find({ where: { cd: { id: cd.id } } });
          datos['nivelmar'] = this.formatNivelmar(nivelmares);
        }

        // if (cd.tipos.includes(ComponenteEnum.OLEAJE)) {
        //   const oleajes = await this.oleajeRepo.find({ where: { cd: { id: cd.id } } });
        //   datos['oleaje'] = this.formatOleaje(oleajes);
        // }


        // if (cd.tipos.includes(ComponenteEnum.CORRIENTE)) {
        //   const corrientes = await this.corrienteRepo.find({ where: { cd: { id: cd.id } } });
        //   datos['corriente'] = this.formatCorriente(corrientes);
        // }

        // if (cd.tipos.includes(ComponenteEnum.MAREA)) {
        //   const mareas = await this.mareaRepo.find({ where: { cd: { id: cd.id } } });
        //   datos['marea'] = this.formatMarea(mareas);
        // }


        // if (cd.tipos.includes(ComponenteEnum.SEDIMENTO)) {
        //   const sedimentos = await this.sedimentoRepo.find({ where: { cd: { id: cd.id } } });
        //   datos['sedimento'] = this.formatSedimento(sedimentos);
        // }

        campaniasObj[campania.nombre] = {
          id: campania.id,
          nombre: campania.nombre,
          descripcion: campania.descripcion,
          fecha: campania.fecha,
          epoca: campania.epoca,
          componentes: cd.tipos,
          datos,
        };
      }

      resultado.push({
        id: dispositivo.id,
        nombre: dispositivo.nombre,
        descripcion: dispositivo.descripcion,
        puerto: {
          id: dispositivo.puerto.id,
          name: dispositivo.puerto.name,
        },
        campanias: campaniasObj,
      });
    }

    return {
      success: true,
      message: 'Dispositivos obtenidos correctamente.',
      data: resultado,
    };
  }

  async getPuertoCampaniaProfundidad(param: ObtenerPuertoProfundidadDto) {
    const dispositivos = await this.dispositivoRepo
      .createQueryBuilder('dispositivo')
      .leftJoinAndSelect('dispositivo.puerto', 'puerto')
      .leftJoinAndSelect('dispositivo.campaniasDispositivos', 'cd')
      .leftJoinAndSelect('cd.campania', 'campania')
      .where('puerto.name = :puerto', { puerto: param.puerto })
      .andWhere('campania.nombre = :campania', { campania: param.campania })
      .getMany();

    if (!dispositivos || dispositivos.length === 0) {
      return {
        success: false,
        message: 'No se encontraron dispositivos.',
        resultado: [],
      };
    }

    const resultado: {
      estacion: string;
      localizacion: any;
      datos: { temperatura: number; salinidad: number }[];
    }[] = [];

    for (const dispositivo of dispositivos) {
      const datosArray: any[] = [];

      for (const cd of dispositivo.campaniasDispositivos) {
        if (cd.tipos.includes(ComponenteEnum.PERFILESCTD)) {
          const perfilctds = await this.perfilRepo.find({
            where: { cd: { id: cd.id }, profundidad: param.profundidad },
          });

          // Suponiendo que cada perfilctd tiene .temperatura y .salinidad
          for (const perfil of perfilctds) {
            datosArray.push({
              temperatura: perfil.temperatura,
              salinidad: perfil.salinidad,
            });
          }
        }
      }

      resultado.push({
        estacion: dispositivo.nombre,
        localizacion: dispositivo.localizacion,
        datos: datosArray,
      });
    }

    return {
      success: true,
      message: 'Dispositivos obtenidos correctamente.',
      campania: param.campania,
      puerto: param.puerto,
      profundidad: param.profundidad,
      resultado,
    };
  }
}

