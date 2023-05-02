import { sign, verify } from 'jsonwebtoken';
import { User } from '../../user/model/User';
import { getRepository } from 'typeorm';
import { UnauthorizedError } from 'routing-controllers';
import bcrypt from 'bcrypt';
import { getJwtSecret } from '../../env';

export class LoginService {
  sign(user: User): string {
    return sign({ id: user.id, email: user.email }, getJwtSecret(), { expiresIn: '1h' });
  }

  verify(token: string): { id: string; email: string } {
    return verify(token, getJwtSecret()) as { id: string; email: string };
  }

  async login(email: string, password: string): Promise<string> {
    const user = await getRepository(User).findOne({ email: email });
    if (!user) {
      throw new UnauthorizedError('Invalid email or password');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedError('Invalid email or password');
    }
    const token = this.sign(user);

    return token;
  }
}
