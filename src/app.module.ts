import { Module } from '@nestjs/common';
import { DatabaseModule } from './database/database.module';
import { GeojsonModule } from './geojson/geojson.module';
import { PuertosModule } from './puertos/puertos.module';
import { GeojsonlayerModule } from './geojsonlayer/geojsonlayer.module';
import { GeojsoniaModule } from './geojsonia/geojsonia.module';
import { ServidorModule } from './servidor/servidor.module';
import { GeoserverlayerModule } from './geoserverlayer/geoserverlayer.module';
import { CampaniaModule } from './campania/campania.module';
import { DispositivoModule } from './dispositivo/dispositivo.module';
import { PerfilCtdModule } from './TipoComponentes/perfil-ctd/perfil-ctd.module';
import { MareaModule } from './TipoComponentes/marea/marea.module';
import { NivelmarModule } from './TipoComponentes/nivelmar/nivelmar.module';
import { CorrienteModule } from './TipoComponentes/corriente/corriente.module';
import { SedimentoModule } from './TipoComponentes/sedimento/sedimento.module';
import { OleajeModule } from './TipoComponentes/oleaje/oleaje.module';
import { ConsultaModule } from './consulta/consulta.module';
import { CampaniadispositivoModule } from './campaniadispositivo/campaniadispositivo.module';
import { ShapefileModule } from './shapefile/shapefile.module';
import { RasterModule } from './raster/raster.module';

@Module({
  imports: [
    DatabaseModule,
    GeojsonModule, 
    PuertosModule, 
    GeojsonlayerModule, 
    GeojsoniaModule, 
    ServidorModule, 
    GeoserverlayerModule, 
    CampaniaModule, 
    DispositivoModule, 
    PerfilCtdModule,
    MareaModule,
    NivelmarModule,
    CorrienteModule,
    SedimentoModule,
    OleajeModule,
    ConsultaModule,
    CampaniadispositivoModule,
    ShapefileModule,
    RasterModule,
  ],
})
export class AppModule {}
