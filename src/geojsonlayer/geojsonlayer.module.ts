import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GeojsonlayerService } from './geojsonlayer.service';
import { GeojsonLayer } from './entities/geojsonlayer.entity';
import { GeojsonlayerController } from './geojsonlayer.controller';
import { Geojson } from 'src/geojson/entities/geojson.entity';
import { Puertos } from 'src/puertos/entities/puerto.entity';

@Module({
  imports: [TypeOrmModule.forFeature([GeojsonLayer,Geojson,Puertos])],
  controllers: [GeojsonlayerController],
  providers: [GeojsonlayerService],
  exports: [GeojsonlayerService],
})
export class GeojsonlayerModule {}