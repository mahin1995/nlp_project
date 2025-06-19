import { NextFunction, Response } from 'express';
import { body } from 'express-validator';
import Container from 'typedi';
import {
  Body,
  Controller,
  Next,
  Req,
  Res,
  SwaggerDoc,
} from '../../common/decorator/controller.decorator';
import { Middleware } from '../../common/decorator/middleware.decorator';
import { Post } from '../../common/decorator/router.decorator';
import { AuthService } from '../service/auth.service';

@Controller('/api/v1/auth')
export default class AuthController {
  protected service = Container.get(AuthService);
  @SwaggerDoc({
    summary: 'Login User',
    bodyExample: {
      type: 'object',
      properties: {
        username: { type: 'string', example: 'admin' },
        password: { type: 'string', example: 'admin123' },
      },
    },
    responses: {
      200: { description: 'Login successful' },
    },
  })
  @Post('/login')
  @Middleware((req: any, res: any, next: any) => {
    body('username').notEmpty().withMessage('Username is required'),
      body('password').notEmpty().withMessage('Password is required'),
      body('email').optional().isEmail().withMessage('Invalid email format'),
      next();
  })
  async login(
    @Req() req: Request,
    @Res() res: Response,
    @Next() next: NextFunction,
    @Body() body: any
  ) {
    try {
      let { email, username, password } = body;
      const result = await this.service.loginUser({
        email,
        username,
        password,
      });
      res.json(result);
    } catch (error) {
      next(error);
      // Logger.logError(error);
    }
  }
}
