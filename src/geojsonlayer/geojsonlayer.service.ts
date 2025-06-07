import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GeojsonLayer } from './entities/geojsonlayer.entity';
import { CreateGeojsonlayerDto } from './dto/create-geojsonlayer.dto';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class GeojsonlayerService {
  constructor(
    @InjectRepository(GeojsonLayer)
    private readonly repo: Repository<GeojsonLayer>,
  ) {}

  async create(createGeojsonlayerDto: CreateGeojsonlayerDto): Promise<GeojsonLayer> {
    const { name, puerto_id } = createGeojsonlayerDto;

    // 🔹 Generar estructura `collections` con IDs únicos y `features` vacíos
    const collections = {};
    for (let i = 1; i <= 24; i++) {
      const capaKey = `capa${i}`;
      collections[capaKey] = {
        id: uuidv4(),  // Genera un UUID único para la capa
        subcapas: [],   // Inicialmente vacío
      };
    }

    const newLayer = this.repo.create({
      name,
      puerto: { id: puerto_id },
      collections, // 🔹 Agregamos la estructura inicial
    });

    return await this.repo.save(newLayer);
  }

  async findAll(): Promise<GeojsonLayer[]> {
    return await this.repo.find();
  }
}
