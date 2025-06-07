import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber } from 'class-validator';

export class CreateSedimentoDto {
  @IsString()
  hora: string;

  @IsNumber()
  salinidad: number;

  @IsNumber()
  temperatura: number;

  @IsNumber()
  profundidad: number;

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
