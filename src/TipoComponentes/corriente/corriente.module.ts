/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { CorrienteService } from './corriente.service';
import { CorrienteController } from './corriente.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Corriente } from './entities/corriente.entity';
import { CampaniadispositivoModule } from 'src/campaniadispositivo/campaniadispositivo.module';

@Module({
  imports: [
      TypeOrmModule.forFeature([Corriente]),
      CampaniadispositivoModule,
    ],
  controllers: [CorrienteController],
  providers: [CorrienteService],
  exports:  [CorrienteService],
})
export class CorrienteModule {}
