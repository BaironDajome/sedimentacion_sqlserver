import { Type } from 'class-transformer';
import { IsString, IsDateString, IsEnum, IsArray, IsNotEmpty, ValidateNested } from 'class-validator';
import { DispositivoCampaniaDto } from 'src/campaniadispositivo/dto/create-campaniadispositivo.dto';
import { EpocaEnum } from 'src/enums/tipo-epoca.enum';
export class CreateCampaniaDto {
  @IsString()
  @IsNotEmpty()
  nombre: string;

  @IsString()
  @IsNotEmpty()
  descripcion: string;

  @IsDateString()
  fecha: string;

  @IsEnum(EpocaEnum)
  epoca: EpocaEnum;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => DispositivoCampaniaDto)
  dispositivos: DispositivoCampaniaDto[];
}





