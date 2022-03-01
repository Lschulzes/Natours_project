import { catchAsync } from './../resources/helpers';
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import UserModel from '../models/UserModel';

export const signup = catchAsync(
  async (req: Request, res: Response, _next: NextFunction) => {
    const userInfo = {
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      passwordConfirm: req.body.passwordConfirm,
    };

    const user = await UserModel.create(userInfo);
    const jwtSecret = process.env.JWT_SECRET as string;
    const expiresIn = process.env.JWT_EXPIRES_IN as string;

    const token = jwt.sign({ id: user._id }, jwtSecret, {
      expiresIn,
    });

    res.status(201).json({
      status: 'success',
      token,
      data: { user },
    });
  }
);

export const signin = catchAsync(
  async (_req: Request, _res: Response, _next: NextFunction) => {}
);

export const signout = catchAsync(
  async (_req: Request, _res: Response, _next: NextFunction) => {}
);
