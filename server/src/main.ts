import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // Настройка статических файлов
  app.useStaticAssets(join(__dirname, '..', 'uploads'), {
    prefix: '/uploads/',
  });

  // Глобальная валидация
  app.useGlobalPipes(new ValidationPipe());

  // Глобальный префикс API
  app.setGlobalPrefix('api');

  // Включение CORS
  app.enableCors();

  await app.listen(process.env.PORT ?? 3000);
  
  console.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();