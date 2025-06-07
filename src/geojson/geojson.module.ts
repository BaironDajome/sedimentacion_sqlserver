/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { GeoJsonService  } from './geojson.service';
import { GeojsonController } from './geojson.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Geojson } from './entities/geojson.entity';
import { MulterModule } from '@nestjs/platform-express';
import { GeojsonLayer } from 'src/geojsonlayer/entities/geojsonlayer.entity';
import { Puertos } from 'src/puertos/entities/puerto.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Geojson,GeojsonLayer,Puertos]),
  MulterModule.register({
    dest: './uploads', // Asegúrate de que esta carpeta existe
}),
],
  controllers: [GeojsonController],
  providers: [GeoJsonService ],
  exports: [GeoJsonService ],
})
export class GeojsonModule {}
