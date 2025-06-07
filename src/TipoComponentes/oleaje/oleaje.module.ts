import { Module } from '@nestjs/common';
import { OleajeService } from './oleaje.service';
import { OleajeController } from './oleaje.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Oleaje } from './entities/oleaje.entity';
import { CampaniadispositivoModule } from 'src/campaniadispositivo/campaniadispositivo.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Oleaje]),
    CampaniadispositivoModule,
  ],
  controllers: [OleajeController],
  providers: [OleajeService],
  exports: [OleajeService],
})
export class OleajeModule { }
