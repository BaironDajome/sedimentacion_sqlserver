/* eslint-disable prettier/prettier */
import { forwardRef, Module } from '@nestjs/common';
import { MareaService } from './marea.service';
import { MareaController } from './marea.controller';
import { Marea } from './entities/marea.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CampaniadispositivoModule } from 'src/campaniadispositivo/campaniadispositivo.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Marea]),
    CampaniadispositivoModule,
  ],
  controllers: [MareaController],
  providers: [MareaService],
  exports: [MareaService],
})
export class MareaModule {}
