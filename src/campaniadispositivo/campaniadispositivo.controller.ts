import { Controller } from '@nestjs/common';
import { CampaniadispositivoService } from './campaniadispositivo.service';

@Controller('campaniadispositivo')
export class CampaniadispositivoController {
  constructor(private readonly campaniadispositivoService: CampaniadispositivoService) {}

}
