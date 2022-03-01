import { createUser } from './UserController';
import { catchAsync } from './../resources/helpers';
import { Request, Response, NextFunction } from 'express';

export const signup = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    req.body = {
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      passwordConfirm: req.body.passwordConfirm,
    };

    await createUser(req, res, next);
  }
);

export const signin = catchAsync(
  async (_req: Request, _res: Response, _next: NextFunction) => {}
);

export const signout = catchAsync(
  async (_req: Request, _res: Response, _next: NextFunction) => {}
);
