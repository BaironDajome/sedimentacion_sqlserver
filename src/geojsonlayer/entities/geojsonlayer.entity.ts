// geojson-layer.entity.ts
import { Puertos } from "src/puertos/entities/puerto.entity";
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";

@Entity('geojson_layer')
export class GeojsonLayer {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  // 🔗 Relación con Puertos
  @ManyToOne(() => Puertos, { eager: true, nullable: false })
  @JoinColumn({ name: 'puerto_id' })
  puerto: Puertos;

@Column({
  type: 'nvarchar',
  length: 'max',
  nullable: true,
  default: () => "N'{}'", // SQL Server syntax for default JSON object
  transformer: {
    to: (value: any) => JSON.stringify(value),
    from: (value: string) => value ? JSON.parse(value) : {},
  },
})
collections: Record<string, { id: string; subcapas: string[] }>;
}
