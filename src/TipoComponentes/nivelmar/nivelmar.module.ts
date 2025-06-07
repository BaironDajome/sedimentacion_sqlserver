import { Module } from '@nestjs/common';
import { NivelmarService } from './nivelmar.service';
import { NivelmarController } from './nivelmar.controller';
import { NivelMar } from './entities/nivelmar.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CampaniadispositivoModule } from 'src/campaniadispositivo/campaniadispositivo.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([NivelMar]),
    CampaniadispositivoModule,
  ],
  controllers: [NivelmarController],
  providers: [NivelmarService],
  exports:[NivelmarService]
})
export class NivelmarModule {}
