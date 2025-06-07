/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { SedimentoService } from './sedimento.service';
import { SedimentoController } from './sedimento.controller';
import { Sedimento } from './entities/sedimento.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CampaniadispositivoModule } from 'src/campaniadispositivo/campaniadispositivo.module';

@Module({
  imports: [
      TypeOrmModule.forFeature([Sedimento]),
      CampaniadispositivoModule,
    ],
  controllers: [SedimentoController],
  providers: [SedimentoService],
  exports: [SedimentoService],
})
export class SedimentoModule {}
