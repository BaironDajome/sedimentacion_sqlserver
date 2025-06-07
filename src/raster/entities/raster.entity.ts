import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
@Entity()
export class Raster {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    filename: string;

    @Column()
    path: string;

    @Column({ type: 'geometry', spatialFeatureType: 'Polygon', srid: 4326 })
    bbox: any;

    @Column()
    crs: string;
}

