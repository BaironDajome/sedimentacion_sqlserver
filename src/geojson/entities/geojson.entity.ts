import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { GeojsonLayer } from "src/geojsonlayer/entities/geojsonlayer.entity";

@Entity('geojson_data')
export class Geojson {
  @PrimaryGeneratedColumn('uuid')
  id: string; // ✅ Un solo UUID por cada `FeatureCollection`

  @Column()
  name: string; // ✅ Nombre global (Ej: '20210701')

  @Column({
  type: 'nvarchar',
  length: 'max',
  nullable: false,
  transformer: {
    to: (value: any) => JSON.stringify(value),
    from: (value: string) => value ? JSON.parse(value) : null,
  },
})
datos: any; // ✅ Guarda TODO el FeatureCollection en una sola fila


  @ManyToOne(() => GeojsonLayer, geojsonLayer => geojsonLayer.collections, { nullable: false, eager: true })
  @JoinColumn({ name: 'layer_id' })
  layer: GeojsonLayer;

}
