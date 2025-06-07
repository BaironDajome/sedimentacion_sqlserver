import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe({
    transform: true,        // transforma payload en instancias de clases
    whitelist: true,        // elimina propiedades no definidas en DTO
    forbidNonWhitelisted: true, // arroja error si hay propiedades extra
  }));
  app.setGlobalPrefix('api');

  const port = process.env.PORT ?? 3000;
  await app.listen(port);
  console.log(`API escuchando en http://localhost:${port}/api`);
}
bootstrap();
