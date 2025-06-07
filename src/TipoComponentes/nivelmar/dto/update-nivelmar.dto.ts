import { PartialType } from '@nestjs/swagger';
import { CreateNivelmarDto } from './create-nivelmar.dto';

export class UpdateNivelmarDto extends PartialType(CreateNivelmarDto) {}
