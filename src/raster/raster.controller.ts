import { Controller, Get, Post,UseInterceptors, UploadedFile } from '@nestjs/common';
import { RasterService } from './raster.service';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('raster')
export class RasterController {
  constructor(private readonly rasterService: RasterService) {}

  @Post('subir')
  @UseInterceptors(FileInterceptor('file'))
  uploadRaster(@UploadedFile() file: Express.Multer.File) {
    return this.rasterService.saveRaster(file);
  }

  @Get()
  async getRasters() {
    return this.rasterService.getAllRasters();
  }

}
