import { sendEmail } from './../resources/email';
import {
  catchAsync,
  AppError,
  getUserWithToken,
  getTokenInfo,
} from './../resources/helpers';
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import UserModel from '../models/UserModel';
import { JWTLoginType, RequestCustom } from '../types';

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
      passwordChangedAt: req.body.passwordChangedAt,
      role: req.body.role,
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
      user = await getUserWithToken(token);
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

export const forgotPassword = catchAsync(
  async (req: Request, res: Response, _next: NextFunction) => {
    const user = await UserModel.findOne({ email: req.body.email });
    if (!user)
      throw new AppError('There is no user with that email address', 404);
    // @ts-ignore

    const resetToken = user.createPasswordResetToken();
    await user.save({ validateBeforeSave: false });

    const resetURL = `${req.protocol}://${req.get(
      'host'
    )}/api/v1/users/resetPassword/${resetToken}`;

    const message = `Forgot your password? Submit a PATCH request with your new password and an passwordConfirm to: ${resetURL}.\nIf you didn't forget your password, please ignore this email!`;
    try {
      await sendEmail({
        email: user.email,
        message,
        subject: 'Reset Password',
      });
    } catch (error) {
      user.passwordResetToken = undefined;
      user.passwordResetExpires = undefined;
      await user.save({ validateBeforeSave: false });
      throw new AppError(
        'There was an error sending the email, please try again!',
        500
      );
    }
    res.status(200).json({
      status: 'success',
      message: 'Token sent to email!',
    });
  }
);
export const resetPassword = catchAsync(
  async (_req: Request, _res: Response, next: NextFunction) => {
    next();
  }
);

export const protect = catchAsync(
  async (req: RequestCustom, _res: Response, next: NextFunction) => {
    const bearer = req.headers.authorization;
    if (!bearer) throw new AppError('Please log in to get access', 401);

    const token = bearer?.split(' ')[1];
    const user = await getUserWithToken(token);
    const { iat } = await getTokenInfo<JWTLoginType>(token);

    if (user.changedPasswordAfter(iat))
      throw new AppError('Token expired, please login again!', 401);

    req.user = user;

    next();
  }
);

export const restrictTo = (...roles: string[]) => {
  return (req: RequestCustom, _res: Response, next: NextFunction) => {
    if (!roles.includes(req.user.role))
      throw new AppError(
        'You do not have permission to perform this action.',
        403
      );

    next();
  };
};
