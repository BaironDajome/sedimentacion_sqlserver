/* eslint-disable prettier/prettier */
import { CampaniaDispositivo } from "src/campaniadispositivo/entities/campaniadispositivo.entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Corriente {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'timestamp' }) 
  hora: Date;

  @Column('float')
  velocidad: number;

  @Column('float')
  direccion: number;

  @Column('float')
  profundidad: number;

  @ManyToOne(() => CampaniaDispositivo, cd => cd.corrientes, { nullable: false, eager: true })
  @JoinColumn({ name: 'cd_id' })
  cd: CampaniaDispositivo;
}
