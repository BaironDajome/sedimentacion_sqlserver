import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Puertos } from './entities/puerto.entity';
import { CreatePuertoDto } from './dto/create-puerto.dto';
import { PuertoEnum } from 'src/enums/puerto.enum';



@Injectable()
export class PuertosService {
  constructor(
    @InjectRepository(Puertos)
    private readonly puertoRepository: Repository<Puertos>,
  ) { }
  async create(dto: CreatePuertoDto): Promise<Puertos> {
    const existente = await this.puertoRepository.findOne({
      where: { name: dto.name }, // cambia esto por el campo único relevante
    });

    if (existente) {
      throw new ConflictException(`El puerto con nombre '${dto.name}' ya existe.`);
    }

    const nuevoPuerto = this.puertoRepository.create(dto); // Instancia el nuevo objeto Puerto
    return await this.puertoRepository.save(nuevoPuerto); // Guarda el objeto en la base de datos y lo retorna
  }

  async createMany(createPuertoDtos: CreatePuertoDto[]): Promise<Puertos[]> {
    const nuevosPuertos: CreatePuertoDto[] = [];

    for (const dto of createPuertoDtos) {
      const existente = await this.puertoRepository.findOne({
        where: { name: dto.name }, // cambia esto por el campo único relevante
      });

      if (!existente) {
        nuevosPuertos.push(dto);
      }
    }

    if (nuevosPuertos.length === 0) {
      throw new ConflictException(`Los puertos ya existe.`);
    }

    const entidades = this.puertoRepository.create(nuevosPuertos);
    return await this.puertoRepository.save(entidades);
  }

  async findOneName(nombre: PuertoEnum): Promise<Puertos> {// Busca un puerto por su nombre (usando el enum definido) y lanza una excepción si no lo encuentra
    const puerto = await this.puertoRepository.findOne({ where: { name: nombre } });
    if (!puerto) {
      throw new ConflictException(`Puerto con nombre ${nombre} no encontrado`);
    }
    return puerto;
  }

  async findAll() {// Retorna todos los puertos almacenados en la base de datos
    return this.puertoRepository.find();
  }

  async findOneById(id: string): Promise<Puertos> {// Busca un puerto por su ID único y lanza una excepción si no lo encuentra
    const puerto = await this.puertoRepository.findOne({ where: { id } });

    if (!puerto) {
      throw new ConflictException(`Puerto con ID ${id} no encontrado`);
    }
    return puerto;
  }

  async findOneByIds(ids: string[]): Promise<Puertos[]> {
    return this.puertoRepository.findBy({ id: In(ids) });
  }

  async findManyNames(nombres: PuertoEnum[]): Promise<Puertos[]> {
    const puertos = await this.puertoRepository.find({
      where: nombres.map((nombre) => ({ name: nombre })),
    });

    if (puertos.length !== nombres.length) {
      const encontrados = puertos.map(p => p.name);
      const noEncontrados = nombres.filter(n => !encontrados.includes(n));
      throw new ConflictException(`No se encontraron los siguientes puertos: ${noEncontrados.join(', ')}`);
    }

    return puertos;
  }
}
