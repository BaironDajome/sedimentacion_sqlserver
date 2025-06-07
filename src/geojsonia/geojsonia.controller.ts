/* eslint-disable prettier/prettier */
import { Controller, Post, Body} from '@nestjs/common';
import { GeojsoniaService } from './geojsonia.service';
import { CreateGeojsoniaDto } from './dto/create-geojsonia.dto';
import { UpdateGeojsoniaDto } from './dto/update-geojsonia.dto';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

@Controller('geojsonia')
export class GeojsoniaController {
  constructor(private readonly geojsoniaService: GeojsoniaService) {}

  @Post('query')
  @ApiOperation({ summary: 'Crea consulta IA' })
  @ApiResponse({ status: 201, description: 'Consulta generada' })
  create(@Body() createGeojsoniaDto: CreateGeojsoniaDto) {
    return this.geojsoniaService.generarSQL(createGeojsoniaDto.texto);
  }
  @Post('consultar')
  @ApiOperation({ summary: 'Realiza consulta' })
  @ApiResponse({ status: 201, description: 'Consulta realizada' })
  async consultarGeojson(@Body('texto') queryTexto: string) {
    return this.geojsoniaService.generarYConsultar(queryTexto);
  }

}
