import Container from 'typedi';
import {
  Controller,
  SwaggerDoc,
} from '../../common/decorator/controller.decorator';
import { Post } from '../../common/decorator/router.decorator';
import { AuthService } from '../service/auth.service';

@Controller('/api/v1/auth')
export default class AuthController {
  protected service = Container.get(AuthService);
  @SwaggerDoc({
    summary: 'Login User',
    bodyExample: {
      username: 'user name',
      password: 'password',
    },
    responses: {
      200: { description: 'Login successful' },
    },
  })
  @Post('/login')
  async login(req: any, res: any, next: any) {
    try {
      let { email, username, password } = req.body;
      const body = await this.service.loginUser({ email, username, password });
      res.json(body);
    } catch (error) {
      next(error);
      // Logger.logError(error);
    }
  }
}
