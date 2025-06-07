import { PartialType } from '@nestjs/mapped-types';
import { CreateGeojsoniaDto } from './create-geojsonia.dto';

export class UpdateGeojsoniaDto extends PartialType(CreateGeojsoniaDto) {}
