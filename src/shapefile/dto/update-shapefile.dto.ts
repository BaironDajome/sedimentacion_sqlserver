import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

export class UploadShapefileDto {
  @IsNotEmpty()
  @ApiProperty({ type: 'string', format: 'binary' })
  file: any;
}

