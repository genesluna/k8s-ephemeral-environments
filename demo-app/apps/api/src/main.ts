import { NestFactory } from '@nestjs/core';
import helmet from 'helmet';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Security headers
  app.use(helmet());

  // CORS configuration
  app.enableCors({
    origin: process.env.CORS_ORIGIN || false,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    credentials: true,
  });

  app.setGlobalPrefix('api', {
    exclude: ['/'],
  });

  const port = process.env.PORT || 3000;
  await app.listen(port);

  console.log(`Application is running on port ${port}`);
}

bootstrap();
