import { Injectable } from '@nestjs/common';
import { CampaniaDispositivo } from './entities/campaniadispositivo.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class CampaniadispositivoService {
    constructor(
        @InjectRepository(CampaniaDispositivo)
        private readonly cdRepo: Repository<CampaniaDispositivo>,
    ) { }

    async findOne(campaniaNombre: string, dispositivoNombre: string): Promise<CampaniaDispositivo | null> {
        const cd = await this.cdRepo
            .createQueryBuilder('cd')
            .innerJoinAndSelect('cd.campania', 'campania')
            .innerJoinAndSelect('cd.dispositivo', 'dispositivo')
            .where('campania.nombre = :campaniaNombre', { campaniaNombre })
            .andWhere('dispositivo.nombre = :dispositivoNombre', { dispositivoNombre })
            .getOne();

        return cd ?? null;
    }
}
