import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GeoserverLayer } from './entities/geoserverlayer.entity';

@Injectable()
export class GeoserverlayerService {
  constructor(
    @InjectRepository(GeoserverLayer)
    private geoRepository: Repository<GeoserverLayer>,
  ) {}

  async processGeoJSON(geojsonData: any) {
    const { features } = geojsonData;

    for (const feature of features) {
      const geometry = JSON.stringify(feature.geometry);
      const magnitude = feature.properties?.magnitude || 0; // Si no existe, asigna 0
  
      await this.geoRepository.query(
        `INSERT INTO geoserver_layers (name, geom) VALUES ($1, ST_GeomFromGeoJSON($2))`,
        [magnitude.toString(), geometry], // Guardamos "magnitude" en la columna "name"
      );
    }

    return { message: 'Archivo GeoJSON procesado correctamente' };
  }

  async findAll(): Promise<any> {
    const rows = await this.geoRepository.query(`
      SELECT id, name, ST_AsGeoJSON(geom) as geometry 
      FROM geoserver_layers
    `);

    return {
      type: 'FeatureCollection',
      features: rows.map(row => ({
        type: 'Feature',
        geometry: JSON.parse(row.geometry), // Convertir el JSON a objeto
        properties: {
          id: row.id,
          name: row.name,
        },
      })),
    };
  }
}
