import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GeoserverlayerService } from './geoserverlayer.service';
import { GeoserverlayerController } from './geoserverlayer.controller';
import { GeoserverLayer } from './entities/geoserverlayer.entity';

@Module({
  imports: [TypeOrmModule.forFeature([GeoserverLayer])], // Importa la entidad
  controllers: [GeoserverlayerController],
  providers: [GeoserverlayerService],
  exports: [GeoserverlayerService], // Exportar si otros módulos lo necesitan
})
export class GeoserverlayerModule {}
