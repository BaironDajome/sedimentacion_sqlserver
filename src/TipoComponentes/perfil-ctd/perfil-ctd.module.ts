/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { PerfilCtdService } from './perfil-ctd.service';
import { PerfilCtdController } from './perfil-ctd.controller';
import { TypeOrmModule } from '@nestjs/typeorm/dist/typeorm.module';
import { PerfilCtd } from './entities/perfil-ctd.entity';
import { CampaniadispositivoModule } from 'src/campaniadispositivo/campaniadispositivo.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([PerfilCtd]), 
    CampaniadispositivoModule,
  ],
  controllers: [PerfilCtdController],
  providers: [PerfilCtdService],
  exports: [PerfilCtdService],
})
export class PerfilCtdModule {}
