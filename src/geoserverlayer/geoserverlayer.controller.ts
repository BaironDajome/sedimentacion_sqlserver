import { Controller, Get, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { GeoserverlayerService } from './geoserverlayer.service';
import { Express } from 'express';

@Controller('geoserverlayer')
export class GeoserverlayerController {
  constructor(private readonly geoserverlayerService: GeoserverlayerService) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadGeoJSON(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      return { message: 'No se ha subido ningún archivo' };
    }

    try {
      const geojsonData = JSON.parse(file.buffer.toString('utf8'));
      return this.geoserverlayerService.processGeoJSON(geojsonData);
    } catch (error) {
      return { message: 'Error al procesar el archivo', error: error.message };
    }
  }



  @Get('layers')
  async getLayers() {
    return this.geoserverlayerService.findAll();
  }
}
