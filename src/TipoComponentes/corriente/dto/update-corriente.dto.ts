import { PartialType } from '@nestjs/swagger';
import { CreateCorrienteDto } from './create-corriente.dto';

export class UpdateCorrienteDto extends PartialType(CreateCorrienteDto) {}
