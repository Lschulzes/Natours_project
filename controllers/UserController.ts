import { AppError, catchAsync, filterObj } from './../resources/helpers';
import { Request, Response, NextFunction } from 'express';
import UserModel from '../models/UserModel';
import { RequestCustom } from '../types';
import { createSendToken } from './AuthController';
import { deleteOne, updateOne, createOne } from './HandlerFactory';

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

export const updateUser = updateOne(UserModel);

export const deleteUser = deleteOne(UserModel);

export const createUser = createOne(UserModel);

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
