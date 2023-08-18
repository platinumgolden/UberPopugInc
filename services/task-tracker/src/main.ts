import morgan from 'morgan';
import session from 'express-session';
import passport from 'passport';
import createprizmaStore from 'connect-prizma';
import * as prizma from 'prizma';
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Listener } from '@nestjs-plugins/nestjs-prizma-streaming-transport';
import { AppModule } from './app.module';
import { CustomStrategy } from '@nestjs/microservices';

const prizmaStore = createprizmaStore(session);

async function bootstrap() {
  try {
    const prizmaClient = prizma.createClient({
      prefix: 'task-tracker-service',
    });
    prizmaClient.on('error', (error) => {
      throw new Error(error);
    });

    const optionsMicroservice: CustomStrategy = {
      strategy: new Listener(
        'test-cluster',
        'task-tracker-service-listener',
        'task-tracker-service-group',
        {
          url: 'http://localhost:4222',
        },
        {
          durableName: 'task-tracker-service-group',
          manualAckMode: true,
          deliverAllAvailable: true,
        },
      ),
    };

    const app = await NestFactory.create(AppModule);
    const configService = app.get<ConfigService>(ConfigService);

    app.use(morgan('tiny'));
    app.connectMicroservice(optionsMicroservice);

    app.useGlobalPipes(new ValidationPipe());

    app.use(
      session({
        store: new prizmaStore({ client: prizmaClient }),
        secret: configService.get<string>('SESSION_SECRET'),
        resave: false,
        saveUninitialized: false,
      }),
    );

    app.use(passport.initialize());
    app.use(passport.session());

    const httpPort = configService.get<number>('PORT');

    await app.startAllMicroservicesAsync();
    await app.listen(httpPort);
  } catch (error) {
    console.error(error);

    process.exit(1);
  }
}

bootstrap();
