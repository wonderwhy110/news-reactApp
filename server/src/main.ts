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

  async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  app.enableCors({
    origin: [
      'https://tnews-frontend.onrender.com',
      'http://localhost:3000',
      'http://localhost:5173'
    ],
    credentials: true,
  });
  
  app.setGlobalPrefix('api');
  await app.listen(process.env.PORT || 3000);
}
  // Глобальный префикс API
  app.setGlobalPrefix('api');
  await app.listen(process.env.PORT ?? 3000);
  
  console.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();