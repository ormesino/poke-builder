import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { NestFastifyApplication } from '@nestjs/platform-fastify';
import { AppModule } from './app.module';

async function bootstrap() {
  // Criação da aplicação com o Fastify
  const app = await NestFactory.create<NestFastifyApplication>(AppModule);

  // Utilização do ValidationPipe para validação de dados
  app.useGlobalPipes(new ValidationPipe());
  await app.listen(3000);
}
bootstrap();
