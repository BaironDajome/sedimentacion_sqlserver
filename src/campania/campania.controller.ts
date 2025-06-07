import { Body, Controller, Get, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { CampaniaService } from './campania.service';
import { ApiConsumes, ApiOperation, ApiTags } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';

@ApiTags('Campania')  // Etiqueta para agrupar en Swagger
@Controller('campania')
export class CampaniaController {
  constructor(private readonly campaniaService: CampaniaService) { }

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
    return this.campaniaService.importar(file);
  }

  @Get()
  findAll() {
    return this.campaniaService.findAll();
  }
}

