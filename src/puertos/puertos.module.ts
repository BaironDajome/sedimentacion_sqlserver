/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { PuertosService } from './puertos.service';
import { PuertosController } from './puertos.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Puertos } from './entities/puerto.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Puertos])],
  controllers: [PuertosController],
  providers: [PuertosService],
  exports: [PuertosService],
})
export class PuertosModule {}
