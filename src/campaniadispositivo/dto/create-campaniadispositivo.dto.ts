import { IsArray, IsEnum, IsNotEmpty, IsString } from "class-validator";
import { ComponenteEnum } from "src/enums/tipo-componente.enum";

export class DispositivoCampaniaDto {
  @IsString()
  @IsNotEmpty()
  nombre: string;

  @IsArray()
  @IsEnum(ComponenteEnum, { each: true })
  tipos: ComponenteEnum[];
}