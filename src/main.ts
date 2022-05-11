import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors();
  app.useGlobalPipes(new ValidationPipe());

  const config = new DocumentBuilder()
    .setTitle('API BINGO')
    .setDescription(
      ' Jogo de bingo, desenvolvido em Node utilizando NestJs, armazenamento de dados no Postgres.',
    )
    .setVersion('1.0')
    .addTag('Bingo')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(process.env.PORT || 3333, () => {
    console.log('Rodando neste endereço: http://localhost:3333/api');
  });
}

bootstrap().catch((e) => console.log(`Deu ruim: ${e}`));
