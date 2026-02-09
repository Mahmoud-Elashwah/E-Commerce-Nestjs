import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { AllExceptionsFilter } from './filters/all-exceptions.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api/v1');

  // ✅ SERVER-SIDE VALIDATION (VERY IMPORTANT)
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // remove extra fields
      forbidNonWhitelisted: true, // throw error on unknown fields
      transform: true, // transform payloads to DTOs
    }),
  );
  app.useGlobalFilters(new AllExceptionsFilter());

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
