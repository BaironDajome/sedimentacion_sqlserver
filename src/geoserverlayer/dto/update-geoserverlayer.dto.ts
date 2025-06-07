import { PartialType } from '@nestjs/mapped-types';
import { CreateGeoserverLayerDto } from './create-geoserverlayer.dto';

export class UpdateGeoserverlayerDto extends PartialType(CreateGeoserverLayerDto) {}
