import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';
import { RedocModule, RedocOptions } from 'nestjs-redoc';
declare const module: any;

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {});

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  app.enableCors({
    origin: '*',
    exposedHeaders: ['*', 'Authorization'],
  });

  app.setGlobalPrefix('/api/v1');

  const configService = app.get(ConfigService);
  const port = configService.get('PORT', 80);

  const options = new DocumentBuilder()
    .addOAuth2({
      type: 'oauth2',
      flows: {
        implicit: {
          scopes: {
            'https://www.googleapis.com/auth/userinfo.email': 'Email',
            'https://www.googleapis.com/auth/userinfo.profile': 'Profile',
            openid: 'OpenID',
          },
          authorizationUrl: 'https://accounts.google.com/o/oauth2/v2/auth',
          tokenUrl: 'https://www.googleapis.com/oauth2/v4/token',
        },
      },
    })
    .addBearerAuth()
    .setTitle('Heracles API')
    .setDescription(
      `The Heracles API exposes resources over HTTP Rest API.
        <ol>
          <li>API Documentation is exposed <a href="/" target="_blank">here</a>.</li>
          <li>Swagger UI to interact with the API is exposed <a href="/api/v1" target="_blank">here</a>.</li>
        </ol>`,
    )
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('/api/v1', app, document, {
    swaggerOptions: {
      oauth2RedirectUrl: `http://localhost:${port}/api/v1/oauth2-redirect.html`,
      oauth: {
        clientId: configService.get('GOOGLE_OAUTH_2_CLIENT_ID') || '',
      },
      docExpansion: 'none',
    },
  });

  const redocOptions: RedocOptions = {
    title: 'Heracles API Documentation.',
    sortPropsAlphabetically: true,
    hideDownloadButton: false,
    hideHostname: false,
  };

  await RedocModule.setup('/', app, document, redocOptions);

  if (module.hot) {
    module.hot.accept();
    module.hot.dispose(() => app.close());
  }

  console.log(`Listening on port [${port}]...`);
  await app.listen(port);
}
bootstrap();
