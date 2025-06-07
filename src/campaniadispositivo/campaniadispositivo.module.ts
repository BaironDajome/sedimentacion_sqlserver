import { Module } from '@nestjs/common';
import { CampaniadispositivoService } from './campaniadispositivo.service';
import { CampaniadispositivoController } from './campaniadispositivo.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Dispositivo } from 'src/dispositivo/entities/dispositivo.entity';
import { CampaniaDispositivo } from './entities/campaniadispositivo.entity';
import { Campania } from 'src/campania/entities/campania.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Campania,
      Dispositivo,
      CampaniaDispositivo
    ]),
  ],
  controllers: [CampaniadispositivoController],
  providers: [CampaniadispositivoService],
  exports:[CampaniadispositivoService],
})
export class CampaniadispositivoModule { }
