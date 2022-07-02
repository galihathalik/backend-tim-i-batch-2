import 'dotenv/config';
import { Logger, ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { EnvironmentUtils } from './utils/enviroment.utils';
import AppConfig, { ServerConfig } from './config/app.config';

const port = process.env.PORT;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: '*',
  });
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidUnknownValues: true,
      transform: true,
    }),
  );
  const swaggerConfig = new DocumentBuilder()
    .setTitle('Ohome360 API Docs')
    .setDescription('Ohome360 API documentation collection')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  const isProduction = new EnvironmentUtils().isProduction();

  if (!isProduction) {
    SwaggerModule.setup('docs', app, document);
  }

  const serverConfig: ServerConfig = AppConfig().server;
  await app.listen(serverConfig.port);
}
bootstrap();
