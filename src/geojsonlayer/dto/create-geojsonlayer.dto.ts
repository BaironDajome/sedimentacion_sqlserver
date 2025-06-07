import {
  IsNotEmpty,
  IsObject,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateGeojsonlayerDto {
  @ApiProperty({
    example: 'Capa de sedimentos',
    description: 'Nombre de la capa geojson',
  })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({
    example: 'd79a3c89-0a7b-4f96-b3fc-0a176e90a3b1',
    description: 'UUID del puerto asociado a la capa',
  })
  @IsUUID()
  puerto_id: string;

  @ApiPropertyOptional({
    description: 'Colección de subcapas agrupadas por tipo',
    example: {
      sedimentos: {
        id: 'layer123',
        subcapas: ['subcapa1', 'subcapa2'],
      },
      temperatura: {
        id: 'layer456',
        subcapas: ['subcapaA'],
      },
    },
    type: 'object',
    additionalProperties: {
      type: 'object',
      properties: {
        id: { type: 'string' },
        subcapas: {
          type: 'array',
          items: { type: 'string' },
        },
      },
    },
  })
  @IsOptional()
  @IsObject()
  collections?: Record<string, { id: string; subcapas: string[] }>;
}
