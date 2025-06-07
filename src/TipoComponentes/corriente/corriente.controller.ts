import { Controller, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { CorrienteService } from './corriente.service';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('corriente')
export class CorrienteController {
  constructor(private readonly corrienteService: CorrienteService) {}

    @Post('importar')
    @UseInterceptors(FileInterceptor('file'))
    async importarComponenteExcel(
      @UploadedFile() file: Express.Multer.File,
    ) {
      if (!file) {
        throw new Error('Archivo Excel no proporcionado');
      }
      return this.corrienteService.importar(file);
    }
}
