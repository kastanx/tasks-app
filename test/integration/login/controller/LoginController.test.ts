import { getRepository } from 'typeorm';
import { createApp } from '../../../../src/createApp';
import request, { SuperTest, Test } from 'supertest';
import { User } from '../../../../src/user/model/User';
import { verify } from 'jsonwebtoken';
import { getJwtSecret } from '../../../../src/env';

describe('LoginController', () => {
  let app: SuperTest<Test>;

  beforeAll(async () => {
    app = request(await createApp());
  });

  beforeEach(async () => {
    await getRepository(User).delete({});
  });

  describe('POST /v1/login', () => {
    it('should log a user', async () => {
      const loginData = { email: 'test@email.com', password: 'test' };
      const passwordHash = '$2b$05$CfWV9KNMneKs9wm5X1rpteG4xWahbxT9yP1vkDm3ksVj6IimdMPB.';
      await getRepository(User).save({ name: 'user', email: loginData.email, password: passwordHash });

      const response = await app.post('/v1/login').send(loginData);
      expect(response.status).toBe(200);

      const decodedToken = verify(response.body, getJwtSecret());
      expect(decodedToken).toEqual(expect.objectContaining({ email: loginData.email }));
    });

    it('should throw 401 if invalid username', async () => {
      const loginData = { email: 'test@email.com', password: 'test' };

      const response = await app.post('/v1/login').send(loginData);
      expect(response.status).toBe(401);
    });

    it('should throw 401 if invalid password', async () => {
      const loginData = { email: 'test@email.com', password: 'invalidPassword' };
      const passwordHash = '$2b$05$CfWV9KNMneKs9wm5X1rpteG4xWahbxT9yP1vkDm3ksVj6IimdMPB.';
      await getRepository(User).save({ name: 'user', email: loginData.email, password: passwordHash });

      const response = await app.post('/v1/login').send(loginData);
      expect(response.status).toBe(401);
    });
  });
});
