import { LoginDto } from '../dto/LoginDto';
import { LoginService } from '../service/LoginService';
import { Post, Body, JsonController } from 'routing-controllers';

@JsonController('/v1/login')
export class LoginController {
  constructor(private readonly loginService: LoginService) {}

  @Post('/')
  async login(@Body() data: LoginDto): Promise<string> {
    return this.loginService.login(data.email, data.password);
  }
}
