import { IsString, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreatePerfilCtdDto {
  @IsString()
  @ApiProperty({
    description: 'Hora de la medición del perfil CTD en formato ISO 8601',
    example: '2023-05-08T14:00:00.000Z',
  })
  hora: string;

  @IsNumber()
  @ApiProperty({
    description: 'Profundidad de la medición en metros',
    example: 20.5,
  })
  profundidad: number;

  @IsNumber()
  @ApiProperty({
    description: 'Temperatura del agua en grados Celsius',
    example: 28.3,
  })
  temperatura: number;

  @IsNumber()
  @ApiProperty({
    description: 'Salinidad del agua en PSU (Practical Salinity Units)',
    example: 35.4,
  })
  salinidad: number;

  @IsString()
  @ApiProperty({
    description: 'nombre de campaña asociado',
    example: 'bad1c448-ce8a-45af-b6fc-e8fe7dd0a756',
  })
  campania: string;

  @IsString()
  @ApiProperty({
    description: 'nombre de dispositivo asociado',
    example: 'bad1c448-ce8a-45af-b6fc-e8fe7dd0a756',
  })
  dispositivo: string;

}

