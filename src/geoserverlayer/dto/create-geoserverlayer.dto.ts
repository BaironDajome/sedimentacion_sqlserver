import { IsString, IsNotEmpty, IsObject } from 'class-validator';

export class CreateGeoserverLayerDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  geom: string; // Debe ser un GeoJSON en formato WKT o equivalente

  @IsObject()
  @IsNotEmpty()
  featureCollection: any; // Aquí podrías definir mejor el tipo
}
