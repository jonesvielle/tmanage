import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
    }),
  );
  app.enableCors();
  app.setBaseViewsDir(join(__dirname, '..', 'views'));
  app.setViewEngine('hbs');
  app.setGlobalPrefix('api/');

  // URI versioning
  app.enableVersioning({
    type: VersioningType.URI,
  });

  // Get required services
  const configService = app.get(ConfigService);

  // Swagger configuration
  const swaggerConfig = new DocumentBuilder()
    // .addBearerAuth()
    .setTitle('Task Management API')
    .setDescription('The Task Management API documentation')
    .setVersion('1.0')
    .addTag('')
    .build();
  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup(`api/docs`, app, document);

  console.log(
    `Application running on port ${configService.get<string>('port')}`,
  );

  await app.listen(configService.get<string>('port'));
}

bootstrap();
