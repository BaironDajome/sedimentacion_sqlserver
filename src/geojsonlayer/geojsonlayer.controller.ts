/* eslint-disable prettier/prettier */
import { Controller, Get, Post, Body } from '@nestjs/common';
import { GeojsonlayerService } from './geojsonlayer.service';
import { CreateGeojsonlayerDto } from './dto/create-geojsonlayer.dto';
import { GeojsonLayer } from './entities/geojsonlayer.entity';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

@Controller('geojsonlayer')
export class GeojsonlayerController {
  constructor(private readonly geojsonlayerService: GeojsonlayerService) {}

  @Post('create')
  @ApiOperation({ summary: 'Crea un layer con las subcapas' })
  @ApiResponse({ status: 201, description: 'layer generado' })
  async create(@Body() createGeojsonlayerDto: CreateGeojsonlayerDto): Promise<GeojsonLayer> {
    return await this.geojsonlayerService.create(createGeojsonlayerDto);
  }

  @Get()
  @ApiOperation({ summary: 'Consulta todos los layer' })
  @ApiResponse({ status: 201, description: 'layer listados' })
  async findAll(): Promise<GeojsonLayer[]> {
    return await this.geojsonlayerService.findAll();
  }
}
