import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { CampaniaDispositivo } from 'src/campaniadispositivo/entities/campaniadispositivo.entity';

@Entity()
export class PerfilCtd {
  @PrimaryGeneratedColumn('uuid')
  @ApiProperty({
    description: 'ID único del perfil CTD',
    example: 'e3a6fcb2-8cb9-4ef7-bd13-315a689d9a0b',
  })
  id: string;

  @Column({ type: 'datetime2' })
  @ApiProperty({
    description: 'Hora de la medición del perfil CTD',
    example: '2023-05-08T14:00:00.000Z',
  })
  hora: Date;

  @Column({ type: 'float' }) 
  @ApiProperty({
    description: 'Profundidad de la medición en metros',
    example: 20.5,
  })
  profundidad: number;

  @Column({ type: 'float' })
  @ApiProperty({
    description: 'Temperatura del agua en grados Celsius',
    example: 28.3,
  })
  temperatura: number;

  @Column({ type: 'float' })
  @ApiProperty({
    description: 'Salinidad del agua en PSU (Practical Salinity Units)',
    example: 35.4,
  })
  salinidad: number;

  @ManyToOne(() => CampaniaDispositivo, cd => cd.perfilctd, {
    nullable: false,
    eager: true,
  })
  @JoinColumn({ name: 'cd_id' })
  cd: CampaniaDispositivo;
}



