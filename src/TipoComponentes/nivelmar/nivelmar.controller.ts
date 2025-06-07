/* eslint-disable prettier/prettier */
import { Controller, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { NivelmarService } from './nivelmar.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiConsumes, ApiOperation } from '@nestjs/swagger';
@Controller('nivelmar')
export class NivelmarController {
  constructor(private readonly nivelmarService: NivelmarService) { }

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
    return this.nivelmarService.importar(file);
  }

}
