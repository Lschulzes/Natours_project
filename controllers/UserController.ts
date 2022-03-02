import { AppError, catchAsync, filterObj } from './../resources/helpers';
import { Request, Response, NextFunction } from 'express';
import UserModel from '../models/UserModel';
import { RequestCustom } from '../types';
import { createSendToken } from './AuthController';

export const getAllUsers = catchAsync(
  async (_req: Request, res: Response, _next: NextFunction) => {
    const users = await UserModel.find();

    res.status(200).json({
      status: 'success',
      results: users.length,
      data: { users },
    });
  }
);

export const getUser = catchAsync(
  async (_req: Request, _res: Response, _next: NextFunction) => {}
);

export const updateUser = catchAsync(
  async (_req: Request, _res: Response, _next: NextFunction) => {}
);

export const deleteUser = catchAsync(
  async (_req: Request, _res: Response, _next: NextFunction) => {}
);

export const createUser = catchAsync(
  async (req: Request, res: Response, _next: NextFunction) => {
    const user = await UserModel.create(req.body);

    res.status(201).json({
      status: 'success',
      data: { user },
    });
  }
);

export const updateMe = catchAsync(
  async (req: RequestCustom, res: Response, _next: NextFunction) => {
    if (req.body.password || req.body.passwordConfirm)
      throw new AppError('Password cant be updated through here', 400);

    const updateFields = filterObj(req.body, 'name', 'email');

    const user = await UserModel.findByIdAndUpdate(req.user.id, updateFields, {
      new: true,
    });

    createSendToken(user, 200, res);
  }
);

export const deleteMe = catchAsync(
  async (req: RequestCustom, res: Response, _next: NextFunction) => {
    await UserModel.findByIdAndUpdate(req.user.id, { active: false });

    res.status(204).json({
      status: 'success',
    });
  }
);
