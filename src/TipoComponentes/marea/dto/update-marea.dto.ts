import { PartialType } from '@nestjs/swagger';
import { CreateMareaDto } from './create-marea.dto';

export class UpdateMareaDto extends PartialType(CreateMareaDto) {}
