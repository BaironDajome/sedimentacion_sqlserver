import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Raster {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    filename: string;

    @Column()
    path: string;

    @Column({ type: 'geometry', spatialFeatureType: 'Geometry', srid: 4326 })
    bbox: string;

    @Column({ type: 'nvarchar', length: 'max' })
    crs: string;
}
