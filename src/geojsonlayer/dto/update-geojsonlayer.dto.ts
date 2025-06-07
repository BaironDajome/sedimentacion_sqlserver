
import { PartialType } from '@nestjs/mapped-types';
import { CreateGeojsonlayerDto} from './create-geojsonlayer.dto';

export class UpdateGeojsonLayerDto extends PartialType(CreateGeojsonlayerDto) {
  features?: Record<string, any[]>;
}