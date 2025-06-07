import {
  IsNotEmpty,
  IsString,
  IsArray,
  ValidateNested,
  IsObject,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

class GeometryDto {
  @ApiProperty({ example: 'Point', description: 'Tipo de geometría' })
  @IsNotEmpty()
  @IsString()
  type: string;

  @ApiProperty({
    description: 'Coordenadas según el tipo de geometría (Point, LineString, Polygon)',
    oneOf: [
      { type: 'array', items: { type: 'number' }, example: [ -74.08175, 4.60971 ] },             // Point
      { type: 'array', items: { type: 'array', items: { type: 'number' } } },                   // LineString
      { type: 'array', items: { type: 'array', items: { type: 'array', items: { type: 'number' } } } }, // Polygon
    ],
  })
  @IsNotEmpty()
  @IsArray()
  coordinates: number[] | number[][] | number[][][];
}

class FeatureDto {
  @ApiProperty({ example: 'Feature', description: 'Tipo del objeto GeoJSON (debe ser Feature)' })
  @IsNotEmpty()
  @IsString()
  type: string;

  @ApiProperty({
    description: 'Propiedades asociadas a la geometría',
    example: { nombre: 'Estación 1', componente: 'oleaje' },
  })
  @IsNotEmpty()
  @IsObject()
  properties: Record<string, any>;

  @ApiProperty({ type: () => GeometryDto })
  @IsNotEmpty()
  @ValidateNested()
  @Type(() => GeometryDto)
  geometry: GeometryDto;
}

export class GeoJsonDto {
  @ApiProperty({ example: 'FeatureCollection', description: 'Tipo de colección (debe ser FeatureCollection)' })
  @IsNotEmpty()
  @IsString()
  type: string;

  @ApiProperty({ example: 'Estaciones', description: 'Nombre del conjunto de datos' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ type: [FeatureDto], description: 'Lista de entidades geográficas' })
  @IsNotEmpty()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => FeatureDto)
  features: FeatureDto[];
}

