import { Module } from '@nestjs/common';
import { GeojsoniaService } from './geojsonia.service';
import { GeojsoniaController } from './geojsonia.controller';

@Module({
  controllers: [GeojsoniaController],
  providers: [GeojsoniaService]
})
export class GeojsoniaModule {}
