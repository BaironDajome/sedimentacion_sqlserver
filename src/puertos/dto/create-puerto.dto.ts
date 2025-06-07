/* eslint-disable prettier/prettier */
import { IsEnum } from "class-validator";
import { ApiProperty } from '@nestjs/swagger';
import { PuertoEnum } from "src/enums/puerto.enum";

export class CreatePuertoDto {
  @ApiProperty({
    example: 'Puerto de Tumaco/Buenaventura',
    description: 'Nombre del puerto',
  })

  @IsEnum(PuertoEnum)
  name: PuertoEnum;
}