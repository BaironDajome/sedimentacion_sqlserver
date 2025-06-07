import { Entity, PrimaryGeneratedColumn, ManyToOne, Column, JoinColumn, OneToMany } from 'typeorm';
import { Campania } from 'src/campania/entities/campania.entity';
import { Dispositivo } from 'src/dispositivo/entities/dispositivo.entity';
import { ComponenteEnum } from 'src/enums/tipo-componente.enum';
import { PerfilCtd } from 'src/TipoComponentes/perfil-ctd/entities/perfil-ctd.entity';
import { Marea } from 'src/TipoComponentes/marea/entities/marea.entity';
import { NivelMar } from 'src/TipoComponentes/nivelmar/entities/nivelmar.entity';
import { Oleaje } from 'src/TipoComponentes/oleaje/entities/oleaje.entity';
import { Sedimento } from 'src/TipoComponentes/sedimento/entities/sedimento.entity';
import { Corriente } from 'src/TipoComponentes/corriente/entities/corriente.entity';

@Entity('campanias_dispositivos')
export class CampaniaDispositivo {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Campania, (campania) => campania.campaniasDispositivos)
  @JoinColumn({ name: 'campania_id' })
  campania: Campania;

  @ManyToOne(() => Dispositivo, (dispositivo) => dispositivo.campaniasDispositivos)
  @JoinColumn({ name: 'dispositivo_id' })
  dispositivo: Dispositivo;

@Column('nvarchar', { length: 'max' })
  tipos: string; // Aquí guardaremos JSON.stringify de array de enums

  // Para facilitar el uso:
  get tiposArray(): ComponenteEnum[] {
    return this.tipos ? JSON.parse(this.tipos) : [];
  }

  set tiposArray(val: ComponenteEnum[]) {
    this.tipos = JSON.stringify(val);
  }

  @OneToMany(() => PerfilCtd, (perfilctd) => perfilctd.cd)
  perfilctd: PerfilCtd[]

  @OneToMany(() => Marea, (mareas) => mareas.cd)
  mareas: Marea[];

  @OneToMany(() => NivelMar, (nivelmares) => nivelmares.cd)
  nivelmares: NivelMar[];

  @OneToMany(() => Oleaje, (oleajes) => oleajes.cd)
  oleajes: Oleaje[];

  @OneToMany(() => Sedimento, (sedimentos) => sedimentos.cd)
  sedimentos: Sedimento[];

  @OneToMany(() => Corriente, (corrientes) => corrientes.cd)
  corrientes: Corriente[];
}
