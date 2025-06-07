import { Entity, PrimaryGeneratedColumn, Column, Index } from 'typeorm';
import { Geometry } from 'geojson';

@Entity('geoserver_layers')
export class GeoserverLayer {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255 })
  magnitud: string;

  @Column({
    type: 'geometry',
    spatialFeatureType: 'Geometry',
    srid: 4326,
  })
  @Column({ type: 'geometry', spatialFeatureType: 'GeometryCollection', srid: 4326, nullable: true })
  geom: string; // o Buffer si estás usando binario
}
