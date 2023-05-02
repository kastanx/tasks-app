import express from 'express';
import {
  Action,
  HttpError,
  UnauthorizedError,
  useContainer as rcUseContainer,
  useExpressServer,
} from 'routing-controllers';
import Container from 'typedi';
import { useContainer as toUseContainer } from 'typeorm';
import { createConnection } from './database/connection';
import { User } from './user/User';
import { verify } from 'jsonwebtoken';
import { getJwtSecret } from './env';

export const createApp = async () => {
  const app = express();

  rcUseContainer(Container);
  toUseContainer(Container);

  await createConnection();

  useExpressServer(app, {
    controllers: [`${__dirname}/**/*Controller{.js,.ts}`],
    currentUserChecker: (action: Action): User => {
      const authHeader = action.request.headers.authorization;
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        throw new UnauthorizedError('Authorization token is missing or invalid');
      }
      const token = authHeader.substring('Bearer '.length);
      try {
        const decodedToken = verify(token, getJwtSecret()) as User;
        return decodedToken;
      } catch (e) {
        throw new UnauthorizedError('Authorization token is missing or invalid');
      }
    },
  });

  return app;
};
