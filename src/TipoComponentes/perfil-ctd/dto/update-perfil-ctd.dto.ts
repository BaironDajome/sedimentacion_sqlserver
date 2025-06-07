import { PartialType } from '@nestjs/swagger';
import { CreatePerfilCtdDto } from './create-perfil-ctd.dto';

export class UpdatePerfilCtdDto extends PartialType(CreatePerfilCtdDto) {}
