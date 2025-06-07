import { Module } from '@nestjs/common';
import { RasterService } from './raster.service';
import { RasterController } from './raster.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Raster } from './entities/raster.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Raster])],
  controllers: [RasterController],
  providers: [RasterService],
})
export class RasterModule {}
