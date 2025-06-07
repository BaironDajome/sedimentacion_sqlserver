import { Module } from '@nestjs/common';
import { ConsultaService } from './consulta.service';
import { ConsultaController } from './consulta.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Campania } from 'src/campania/entities/campania.entity';
import { Oleaje } from 'src/TipoComponentes/oleaje/entities/oleaje.entity';
import { Sedimento } from 'src/TipoComponentes/sedimento/entities/sedimento.entity';
import { PerfilCtd } from 'src/TipoComponentes/perfil-ctd/entities/perfil-ctd.entity';
import { Marea } from 'src/TipoComponentes/marea/entities/marea.entity';
import { NivelMar } from 'src/TipoComponentes/nivelmar/entities/nivelmar.entity';
import { Corriente } from 'src/TipoComponentes/corriente/entities/corriente.entity';
import { Dispositivo } from 'src/dispositivo/entities/dispositivo.entity';
import { DispositivoModule } from 'src/dispositivo/dispositivo.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Dispositivo,
      Campania,
      PerfilCtd,
      Oleaje,
      Corriente,
      Marea,
      Sedimento,
      NivelMar,
    ]),
    DispositivoModule
  ],   
  controllers: [ConsultaController],
  providers: [ConsultaService]
})
export class ConsultaModule {}
