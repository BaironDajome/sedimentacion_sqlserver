import { CampaniaDispositivo } from "src/campaniadispositivo/entities/campaniadispositivo.entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Oleaje {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'timestamp' }) 
  hora: Date;

  @Column('float')
  altura_significativa: number;

  @Column('float')
  periodo_pico: number;

  @Column('float')
  direccion: number;
 
  @ManyToOne(() => CampaniaDispositivo, cd => cd.nivelmares, { nullable: false, eager: true })
  @JoinColumn({ name: 'cd_id' })
  cd: CampaniaDispositivo;
}

