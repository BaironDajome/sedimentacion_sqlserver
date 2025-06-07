/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { CampaniaService } from './campania.service';
import { CampaniaController } from './campania.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Campania } from './entities/campania.entity';
import { PuertosModule } from 'src/puertos/puertos.module';
import { DispositivoModule } from 'src/dispositivo/dispositivo.module';
import { CampaniaDispositivo } from 'src/campaniadispositivo/entities/campaniadispositivo.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Campania,CampaniaDispositivo]),
    PuertosModule,
    DispositivoModule

  ],
  providers: [CampaniaService],
  controllers: [CampaniaController],
  exports: [CampaniaService],
})
export class CampaniaModule {}
