import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ServidorService } from './servidor.service';
import { CreateServidorDto } from './dto/create-servidor.dto';
import { UpdateServidorDto } from './dto/update-servidor.dto';

@Controller('servidor')
export class ServidorController {
  constructor(private readonly servidorService: ServidorService) {}

}

