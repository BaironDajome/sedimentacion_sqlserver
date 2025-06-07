import { PartialType } from '@nestjs/swagger';
import { CreateSedimentoDto } from './create-sedimento.dto';

export class UpdateSedimentoDto extends PartialType(CreateSedimentoDto) {}
