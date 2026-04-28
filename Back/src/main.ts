import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  app.enableCors();

  const swaggerConfig = new DocumentBuilder()
    .setTitle('Soporte Técnico API')
    .setDescription(
      `API REST para la gestión de solicitudes de soporte técnico.\n\n` +
      `## Arquitectura\n` +
      `- **Capas:** Controller → Service → Repository\n` +
      `- **Patrones:** DTO (validación) + Observer (automatizaciones)\n\n` +
      `## Automatizaciones\n` +
      `Al asignar un responsable a un ticket, se dispara un evento ` +
      `\`ticket.assigned\` de forma **asíncrona y desacoplada** que envía ` +
      `una notificación por email al responsable.`,
    )
    .setVersion('1.0')
    .addTag('Tickets', 'Gestión de solicitudes de soporte técnico')
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api/docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
      tagsSorter: 'alpha',
      operationsSorter: 'alpha',
    },
  });

  const port = process.env.PORT ?? 3000;
  await app.listen(port);
  console.log(`Backend corriendo en http://localhost:${port}`);
  console.log(`Swagger docs en    http://localhost:${port}/api/docs`);
}

bootstrap();
