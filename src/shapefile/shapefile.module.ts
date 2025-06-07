import { Module } from '@nestjs/common';
import { ShapefileService } from './shapefile.service';
import { ShapefileController } from './shapefile.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Shapefile } from './entities/shapefile.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Shapefile])],
  controllers: [ShapefileController],
  providers: [ShapefileService],
})
export class ShapefileModule { }
