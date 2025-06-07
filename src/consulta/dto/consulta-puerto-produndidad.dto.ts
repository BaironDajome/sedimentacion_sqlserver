import { IsEnum, IsNotEmpty, IsNumber, IsString } from "class-validator";
import { PuertoEnum } from "src/enums/puerto.enum";

export class ObtenerPuertoProfundidadDto {
  @IsEnum(PuertoEnum)
  puerto: PuertoEnum;

  @IsString()
  @IsNotEmpty()
  campania: string;

  @IsNumber()
  profundidad: number;
}

