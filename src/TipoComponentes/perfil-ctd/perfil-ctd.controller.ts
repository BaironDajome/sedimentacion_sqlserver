import { Controller, Post, UseInterceptors, UploadedFile } from '@nestjs/common';
import { PerfilCtdService } from './perfil-ctd.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiConsumes, ApiOperation } from '@nestjs/swagger';

@Controller('perfilctd')
export class PerfilCtdController {
  constructor(private readonly perfilCtdService: PerfilCtdService) {}

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
    return this.perfilCtdService.importar(file);
  }
}
