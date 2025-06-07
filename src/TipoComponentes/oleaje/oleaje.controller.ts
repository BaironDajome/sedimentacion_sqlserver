import { Controller, Post, UseInterceptors, UploadedFile } from '@nestjs/common';
import { OleajeService } from './oleaje.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiConsumes, ApiOperation } from '@nestjs/swagger';

@Controller('oleaje')
export class OleajeController {
  constructor(private readonly oleajeService: OleajeService) {}

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
    return this.oleajeService.importar(file);
  }
}
