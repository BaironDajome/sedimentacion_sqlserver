import { ConfigModule, ConfigService } from '@nestjs/config';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }), // Carga .env automáticamente
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'mssql',
        host: config.get<string>('DB_HOST') ?? 'localhost',
        port: parseInt(config.get<string>('DB_PORT') ?? '1433', 10),
        username: config.get<string>('DB_USERNAME') ?? 'sa',
        password: config.get<string>('DB_PASSWORD') ?? '',
        database: config.get<string>('DB_NAME') ?? 'test',
        synchronize: config.get<string>('DB_SYNCHRONIZE') === 'true',
        entities: [__dirname + '/../**/*.entity{.ts,.js}'],
        options: {
          encrypt: false,
        },
      }),
    }),
  ],
})
export class DatabaseModule { }
