/* eslint-disable prettier/prettier */
import { CampaniaDispositivo } from "src/campaniadispositivo/entities/campaniadispositivo.entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Marea {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'timestamp' })
  hora: Date;

  @Column('float')
  altura: number;

  @ManyToOne(() => CampaniaDispositivo, cd => cd.mareas, { nullable: false, eager: true })
  @JoinColumn({ name: 'cd_id' })
  cd: CampaniaDispositivo;
}
