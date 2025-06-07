import { Injectable, OnModuleInit } from '@nestjs/common';
import { spawn } from 'child_process';
import * as path from 'path';

@Injectable()
export class ServidorService implements OnModuleInit {
  private tileserverProcess: any;

  onModuleInit() {
    this.startTileServer();
  }

  startTileServer() {

  }
}
