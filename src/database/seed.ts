import { getRepository } from 'typeorm';
import { Task } from '../task/model/Task';
import { createConnection } from './connection';
import { User } from '../user/model/User';

(async () => {
  await createConnection();

  const loginData = { email: 'test@email.com', password: 'test' };
  const passwordHash = '$2b$05$CfWV9KNMneKs9wm5X1rpteG4xWahbxT9yP1vkDm3ksVj6IimdMPB.';
  const user = await getRepository(User).save({ name: 'user', email: loginData.email, password: passwordHash });

  await getRepository(Task).save({ text: 'user task', userId: user.id });
})();
