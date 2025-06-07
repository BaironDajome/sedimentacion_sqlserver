import { Controller, Post, Body, UploadedFile, UseInterceptors, BadRequestException, Get, Param } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import * as fs from 'fs';
import * as path from 'path';
import { GeoJsonService } from './geojson.service';

@Controller('geojson')
export class GeojsonController {
  constructor(private readonly geojsonService: GeoJsonService) {}
//////////////////////////////////////////////////////////////////////


  @Post('upload-geojson')
  @ApiOperation({ summary: 'Guarda archivo en fromato geojson' })
  @ApiResponse({ status: 201, description: 'Archivo guardado' })
  @UseInterceptors(FileInterceptor('file', { dest: './uploads' })) // ✅ Solo permite un archivo
  async uploadGeoJSON(
    @UploadedFile() file: Express.Multer.File,
    @Body() body: { layer_id: string; capa_id: string }
  ) {
    if (!file) {
      throw new BadRequestException('No se subió ningún archivo.');
    }

    const { layer_id, capa_id } = body;
    if (!layer_id || !capa_id) {
      throw new BadRequestException('Faltan datos obligatorios: layer_id o capa_id.');
    }

    // 🔥 Extraemos el nombre sin la extensión ".geojson"
    const name = path.basename(file.originalname, '.geojson');

    try {
      const fileContent = fs.readFileSync(path.resolve(file.path), 'utf-8');
      const geojsonData = JSON.parse(fileContent);

      if (!geojsonData.features || !Array.isArray(geojsonData.features)) {
        throw new BadRequestException(`El archivo ${file.originalname} no tiene una estructura válida de features.`);
      }

      // 📌 Llamamos al servicio para almacenar el GeoJSON
      const result = await this.geojsonService.createFromFile(layer_id, capa_id, name, geojsonData);

      // ✅ Eliminamos el archivo después de procesarlo
      fs.unlinkSync(file.path);

      return result;
    } catch (error) {
      if (fs.existsSync(file.path)) fs.unlinkSync(file.path);
      throw new BadRequestException(`Error procesando el archivo: ${error.message}`);
    }
  }
//////////////////////////////////////////////////////////////////////
  @Get('buscar-subcapa/:subcapa_id')
  @ApiOperation({ summary: 'Busca subcapa por ID' })
  @ApiResponse({ status: 201, description: 'Capa encontrada' })
  async buscarCapa(@Param('subcapa_id') subcapa_id: string) {
  return this.geojsonService.findSubCapaById(subcapa_id);
}
//////////////////////////////////////////////////////////////////////
}
