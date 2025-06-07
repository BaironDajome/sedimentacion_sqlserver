import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFile } from '@nestjs/common';
import { DispositivoService } from './dispositivo.service';
import { CreateDispositivoDto } from './dto/create-dispositivo.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiConsumes, ApiOperation } from '@nestjs/swagger';

@Controller('dispositivo')
export class DispositivoController {
  constructor(private readonly dispositivoService: DispositivoService) { }

  @Post('create')
  create(@Body() createDispositivoDto: CreateDispositivoDto) {
    return this.dispositivoService.create(createDispositivoDto);
  }

  @Post('importar')
  @UseInterceptors(FileInterceptor('file'))
  @ApiOperation({ summary: 'Importar datos desde un archivo Excel' })
  @ApiConsumes('multipart/form-data')
  async importarComponenteExcel(
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (!file) {
      throw new Error('Archivo Excel no proporcionado');
    }
    return this.dispositivoService.importar(file);
  }

  @Get()
  findAll() {
    return this.dispositivoService.findAll();
  }
  @Get('lista')
  Listar() {
    return this.dispositivoService.listaDispositivos();
  }
}
