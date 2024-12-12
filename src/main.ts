import { NestFactory } from '@nestjs/core';
import { AppModule } from './modules/app/app.module';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  // ЭКЗЕМПЛЯР НАШЕГО ПРИЛОЖЕНИЯ
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService); // так мы получаем доступ ко всем методам ConfigService
  // стараемся не использовать глоб. переменные (proccess.env) напрямую, в целях безопасности
  const port = configService.get<number>('port'); // достаем порт

  // НАСТРОЙКА ВАЛИДАЦИИ В ПРОЕКТЕ
  app.useGlobalPipes(new ValidationPipe());

  // СОЗДАНИЕ ДОКУМЕНТАЦИИ
  // с помощью класса DocumentBuilder создадим экземпляр настроек для Swagger
  const config = new DocumentBuilder()
    .setTitle('Lesson API') // настройка загаловка
    .setDescription('This API for lesson')
    .setVersion('1.0')
    .addTag('API')
    .build();
  // Swagger создает документ, описывающий наше приложение и принимающий конфигурации
  const document = SwaggerModule.createDocument(app, config);
  // генерация самого API
  SwaggerModule.setup('/api', app, document);
  // 1-й параметр - префикс, используемый для входа на страницу документации

  await app.listen(port);
}
bootstrap();
