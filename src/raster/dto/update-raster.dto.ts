import { PartialType } from '@nestjs/swagger';
import { CreateRasterDto } from './create-raster.dto';

export class UpdateRasterDto extends PartialType(CreateRasterDto) {}
