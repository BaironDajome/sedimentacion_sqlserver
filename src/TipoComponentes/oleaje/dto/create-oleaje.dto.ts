import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export class CreateOleajeDto {
  @IsString()
  hora: string;

  @IsNumber()
  altura_significativa: number;

  @IsNumber()
  periodo_pico: number;

  @IsNumber()
  direccion: number;

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
