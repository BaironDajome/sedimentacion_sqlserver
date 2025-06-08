import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Shapefile {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'geometry', spatialFeatureType: 'Geometry', srid: 4326 })
  geometry: string; 

  @Column({
    type: 'nvarchar',
    length: 'max',
    nullable: true, // o false, si lo necesitas obligatorio
    transformer: {
      to: (value: any) => JSON.stringify(value),
      from: (value: string) => value ? JSON.parse(value) : null,
    },
  })
  properties: any;

  @Column()
  filename: string;
}

