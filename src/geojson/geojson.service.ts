import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Geojson } from './entities/geojson.entity';
import { GeojsonLayer } from 'src/geojsonlayer/entities/geojsonlayer.entity';

@Injectable()
//////////////////////////////////////////////////////////////////////
export class GeoJsonService {
  constructor(
    @InjectRepository(Geojson)
    private readonly geojsonRepository: Repository<Geojson>,

    @InjectRepository(GeojsonLayer)
    private readonly geojsonLayerRepository: Repository<GeojsonLayer>,
  ) {}
//////////////////////////////////////////////////////////////////////
  async createFromFile(
    layer_id: string,
    capa_id: string,
    name: string,
    geojsonData: any,
  ): Promise<any> {
    // 🔍 Verificar que el layer existe
    const layer = await this.geojsonLayerRepository.findOne({
      where: { id: layer_id },
    });

    if (!layer) {
      throw new NotFoundException('Geojson Layer no encontrado');
    }

    // 🔍 Verificar que la colección (capa) existe dentro del layer
    const collectionsArray = Object.values(layer.collections);
    const collection = collectionsArray.find(col => col.id === capa_id);

    if (!collection) {
      throw new NotFoundException(`No se encontró la capa con ID: ${capa_id}`);
    }

    // console.log('Colección encontrada:', collection);

    // 🔍 Buscar si ya existe un GeoJSON con el mismo `name` en ese `layer`
    let existingGeoJson = await this.geojsonRepository.findOne({
      where: { name, layer },
    });

    if (existingGeoJson) {
      // console.log('Actualizando GeoJSON existente...');
      existingGeoJson.datos = geojsonData; // Actualizar datos
    } else {
      // console.log('Creando un nuevo GeoJSON...');
      existingGeoJson = this.geojsonRepository.create({
        name,
        datos: geojsonData,
        layer,
      });
    }

    // ✅ Guardamos en la base de datos (inserta o actualiza)
    try {
      const savedGeoJson = await this.geojsonRepository.save(existingGeoJson);
      // console.log("Guardado correctamente:", savedGeoJson);

      // 🔹 Asegurarse de que `subcapas` existe como array
      if (!collection.subcapas) {
        collection.subcapas = [];
      }

      // 🔹 Agregar el nuevo UUID a `subcapas` si no está presente
      if (!collection.subcapas.includes(savedGeoJson.id)) {
        collection.subcapas.push(savedGeoJson.id);
        // console.log("UUID agregado a subcapas:", savedGeoJson.id);

        // ✅ Guardar el `layer` actualizado con la nueva `subcapa`
        await this.geojsonLayerRepository.save(layer);
        // console.log("Layer actualizado con la nueva subcapa.");
      } else {
        // console.log("El UUID ya estaba en subcapas, no se duplicó.");
      }

      // 🔢 Obtener el conteo total de registros en la tabla geojson
      const totalCount = await this.geojsonRepository.count();
      // console.log(`Total de registros en la tabla geojson: ${totalCount}`);

      return {
        message: 'GeoJSON guardado correctamente y vinculado a la capa',
        geojsonId: savedGeoJson.id,
        totalRecords: totalCount,
      };
    } catch (error) {
      // console.error("Error al guardar:", error);
      throw new BadRequestException('Error al guardar el GeoJSON');
    }
  }

//////////////////////////////////////////////////////////7
  async findSubCapaById(subcapa_id: string) {
    // 🔍 Buscamos el GeoJSON que tenga el ID de la subcapa
    const geojson = await this.geojsonRepository.findOne({
      where: { id: subcapa_id },
      relations: ['layer'], // Incluimos la capa relacionada
    });
  
    if (!geojson) {
      throw new NotFoundException(`No se encontró la subcapa con ID: ${subcapa_id}`);
    }
  
    return {
      geojson_id: geojson.id,
      name: geojson.name,
      layer_id: geojson.layer.id,
      featureCollection: geojson.datos, 
      message: "Subcapa encontrada en la base de datos",
    };
  }
  
}
