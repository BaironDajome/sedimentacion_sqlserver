import { Body, Controller, Get,Param, Post } from '@nestjs/common';
import { ConsultaService } from './consulta.service';
import { ObtenerPuertoProfundidadDto } from './dto/consulta-puerto-produndidad.dto';


@Controller('consulta')
export class ConsultaController {
  constructor(private readonly consultaService: ConsultaService) {}

// dispositivo
  @Get('detalle/:param')
  async getDetalleByNombre(@Param('param') param: string) {
    const dispositivo = await this.consultaService.getDispositivoDetalle(param);
    return dispositivo;
  }

  @Post('puerto/produndidad')
  obtenerPuertoProfundidad(@Body() createDispositivoDto: ObtenerPuertoProfundidadDto) {
    return this.consultaService.getPuertoCampaniaProfundidad(createDispositivoDto);
  }
  

  // dispositivo
  @Get('completo')
  async getDispositivosCompletos() {
    const dispositivo = await this.consultaService.getDispositivoCompletos();
    return dispositivo;
  }
}
