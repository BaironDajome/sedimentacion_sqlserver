import { PartialType } from '@nestjs/swagger';
import { CreateOleajeDto } from './create-oleaje.dto';

export class UpdateOleajeDto extends PartialType(CreateOleajeDto) {}
