
import { EpocaEnum } from "src/enums/tipo-epoca.enum";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { CampaniaDispositivo } from "src/campaniadispositivo/entities/campaniadispositivo.entity";

@Entity('campanias')
export class Campania {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  nombre: string;

  @Column()
  descripcion: string;

  @Column({ type: 'datetime', nullable: true })
  fecha: Date | null;


  @Column()
  epoca: EpocaEnum;

  @OneToMany(() => CampaniaDispositivo, (cd) => cd.campania)
  campaniasDispositivos: CampaniaDispositivo[];
}
