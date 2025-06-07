import { Controller, Post, UseInterceptors, UploadedFile, Get, Param, } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';          // <- Importar diskStorage
import * as path from 'path';                   // <- Importar path de forma correcta
import { ShapefileService } from './shapefile.service';

@Controller('shapefile')
export class ShapefileController {
  constructor(private readonly shapefileService: ShapefileService) { }

  @Post('subir')
  @UseInterceptors(FileInterceptor('file'))
  async upload(@UploadedFile() file: Express.Multer.File) {
    return this.shapefileService.saveShapefile(file);
  }

  @Post('upload-zip')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          cb(null, `${Date.now()}-${file.originalname}`);
        },
      }),
    }),
  )
  async uploadZip(@UploadedFile() file: Express.Multer.File) {
    const filePath = path.join(file.destination, file.filename);
    const data = await this.shapefileService.readShapefileFromZip(filePath);
    return { message: 'Shapefile leído correctamente', data };
  }
  @Get(':filename')
  async findByFileName(@Param('filename') filename: string) {
    return this.shapefileService.findByFilename(filename);
  }

  @Get()
  async findAll() {
    return this.shapefileService.findAll();
  }
}



