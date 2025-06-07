import { Controller, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { MareaService } from './marea.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiConsumes, ApiOperation } from '@nestjs/swagger';

@Controller('marea')
export class MareaController {
  constructor(private readonly mareaService: MareaService) { }

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
    return this.mareaService.importar(file);
  }
}
