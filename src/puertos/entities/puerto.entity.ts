import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { GeojsonLayer } from 'src/geojsonlayer/entities/geojsonlayer.entity';
import { PuertoEnum } from 'src/enums/puerto.enum';
import { Dispositivo } from 'src/dispositivo/entities/dispositivo.entity';
@Entity()
export class Puertos {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('nvarchar', { length: 100 }) // tamaño según necesidad
  name: string; // guardas el nombre como texto

  // Opcional: getter/setter para usar enum en código

  get nameEnum(): PuertoEnum | null {
    if (!this.name) return null;
    return Object.values(PuertoEnum).includes(this.name as PuertoEnum)
      ? (this.name as PuertoEnum)
      : null;
  }

  set nameEnum(value: PuertoEnum) {
    this.name = value;
  }

  //Relación con GeojsonLayers
  @OneToMany(() => GeojsonLayer, layer => layer.puerto)
  geojsonLayers: GeojsonLayer[];

  @OneToMany(() => Dispositivo, (dispositivo) => dispositivo.puerto)
  dispositivos: Dispositivo[];
}
