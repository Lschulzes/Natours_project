import bcrypt from 'bcryptjs';
import { catchAsync, AppError, hasExpired } from './../resources/helpers';
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

export const login = catchAsync(
  async (req: Request, res: Response, _next: NextFunction) => {
    let { token, email, password } = req.body;
    let user;

    if ((!email || !password) && !token)
      throw new AppError('User credentials needed', 403);

    if (token) {
      const tokenInfo: any = jwt.decode(token);

      if (hasExpired(tokenInfo.exp))
        throw new AppError('Token has expired', 403);

      user = await UserModel.findOne({ _id: tokenInfo.id });
    } else {
      user = await UserModel.findOne({ email });

      const isPasswordCorrect = await bcrypt.compare(password, user.password);
      if (!isPasswordCorrect)
        throw new AppError('Entered Password does not match!', 403);

      const jwtSecret = process.env.JWT_SECRET as string;
      const expiresIn = process.env.JWT_EXPIRES_IN as string;
      token = jwt.sign({ id: user._id }, jwtSecret, { expiresIn });
    }

    if (!user) {
      throw new AppError(
        `Could not find any user with the email of ${req.body.email}`,
        404
      );
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
