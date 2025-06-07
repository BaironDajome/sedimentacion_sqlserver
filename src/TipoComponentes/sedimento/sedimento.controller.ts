import { Controller, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { SedimentoService } from './sedimento.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiConsumes, ApiOperation } from '@nestjs/swagger';

@Controller('sedimento')
export class SedimentoController {
  constructor(private readonly sedimentoService: SedimentoService) { }

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
    return this.sedimentoService.importar(file);
  }
}
