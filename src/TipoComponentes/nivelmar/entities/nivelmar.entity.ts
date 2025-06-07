/* eslint-disable prettier/prettier */
import { CampaniaDispositivo } from "src/campaniadispositivo/entities/campaniadispositivo.entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class NivelMar {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'datetime2' })
  hora: Date;

  @Column('float')
  nivelmar: number;

  @ManyToOne(() => CampaniaDispositivo, cd => cd.nivelmares, { nullable: false, eager: true })
  @JoinColumn({ name: 'cd_id' })
  cd: CampaniaDispositivo;
}
