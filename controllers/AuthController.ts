import { catchAsync, AppError, hasExpired } from './../resources/helpers';
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import UserModel from '../models/UserModel';

const signToken = (id: string) => {
  const jwtSecret = process.env.JWT_SECRET as string;
  const expiresIn = process.env.JWT_EXPIRES_IN as string;
  return jwt.sign({ id }, jwtSecret, { expiresIn });
};

export const signup = catchAsync(
  async (req: Request, res: Response, _next: NextFunction) => {
    const userInfo = {
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      passwordConfirm: req.body.passwordConfirm,
    };

    const user = await UserModel.create(userInfo);

    const token = signToken(user._id);

    res.status(201).json({
      status: 'success',
      token,
      data: { user },
    });
  }
);

export const login = catchAsync(
  async (req: Request, res: Response, _next: NextFunction) => {
    let { token, email, password } = req.body;
    let user;

    if ((!email || !password) && !token)
      throw new AppError('User credentials needed', 400);

    if (token) {
      const tokenInfo: any = jwt.decode(token);

      if (hasExpired(tokenInfo.exp))
        throw new AppError('Token has expired', 400);

      user = await UserModel.findOne({ _id: tokenInfo.id });
      if (!user) throw new AppError(`Invalid token`, 401);
    } else {
      user = await UserModel.findOne({ email }).select('+password');

      if (!user || !(await user.isPasswordCorrect(password, user.password)))
        throw new AppError(`Invalid email or password`, 401);

      token = signToken(user._id);
    }

    res.status(200).json({
      status: 'success',
      token,
      data: { user },
    });
  }
);

export const signout = catchAsync(
  async (_req: Request, _res: Response, _next: NextFunction) => {}
);
