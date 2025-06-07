import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateGeojsoniaDto {
  @ApiProperty({
    example: '{"type":"FeatureCollection","features":[...]}',
    description: 'Contenido GeoJSON como string',
  })
  @IsString()
  texto: string;
}

