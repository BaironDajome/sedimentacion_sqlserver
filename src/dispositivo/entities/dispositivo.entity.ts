import { CampaniaDispositivo } from "src/campaniadispositivo/entities/campaniadispositivo.entity";
import { Puertos } from "src/puertos/entities/puerto.entity";
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity('dispositivos')
export class Dispositivo {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'nvarchar', nullable: true })
  nombre: string;

  @Column({ type: 'nvarchar', nullable: true })
  descripcion: string;


@Column({ type: 'geography', spatialFeatureType: 'Point', srid: 4326 })
  localizacion: string;

  @ManyToOne(() => Puertos, (puerto) => puerto.dispositivos)
  @JoinColumn({ name: 'puerto_id' })
  puerto: Puertos;

  @OneToMany(() => CampaniaDispositivo, (cd) => cd.dispositivo)
  campaniasDispositivos: CampaniaDispositivo[];
}
