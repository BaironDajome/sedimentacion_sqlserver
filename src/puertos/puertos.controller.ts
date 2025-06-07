/* eslint-disable prettier/prettier */
import { Controller, Get, Post, Body } from '@nestjs/common';
import { PuertosService } from './puertos.service';
import { CreatePuertoDto } from './dto/create-puerto.dto';

@Controller('puertos')
export class PuertosController {
  constructor(private readonly puertosService: PuertosService) {}

  @Post('create')
  create(@Body() createPuertoDto: CreatePuertoDto) {
    return this.puertosService.create(createPuertoDto);
  }

  @Post('create-multiple')
  createMany(@Body() createPuertoDto: CreatePuertoDto[]) {
    return this.puertosService.createMany(createPuertoDto);
  }

  @Get()
  findAll() {
    return this.puertosService.findAll();
  }
}
