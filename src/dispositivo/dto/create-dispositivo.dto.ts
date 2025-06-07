import { IsNumber, IsString } from "class-validator";
import { PuertoEnum } from "src/enums/puerto.enum";

export class CreateDispositivoDto {
  @IsString()
  nombre: string;

  @IsString()
  descripcion: string;

  @IsNumber()
  latitud: number;

  @IsNumber()
  longitud: number;

  @IsString()
  puerto: PuertoEnum;
}
