/* eslint-disable prettier/prettier */
import { CampaniaDispositivo } from "src/campaniadispositivo/entities/campaniadispositivo.entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Sedimento {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'timestamp' }) 
  hora: Date;

  @Column('float')
  salinidad: number;

  @Column('float')
  temperatura: number;

  @Column('float')
  profundidad: number;


  @ManyToOne(() => CampaniaDispositivo, cd => cd.sedimentos, { nullable: false, eager: true })
  @JoinColumn({ name: 'cd_id' })
  cd: CampaniaDispositivo;
}
