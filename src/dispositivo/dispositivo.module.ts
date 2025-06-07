import { Module } from '@nestjs/common';
import { DispositivoService } from './dispositivo.service';
import { DispositivoController } from './dispositivo.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Dispositivo } from './entities/dispositivo.entity';
import { PuertosModule } from 'src/puertos/puertos.module';


@Module({
  imports: [
    TypeOrmModule.forFeature([Dispositivo]),
    PuertosModule,

  ],
  controllers: [DispositivoController],
  providers: [DispositivoService],
  exports: [DispositivoService],
})
export class DispositivoModule { }
