import { AppError, catchAsync, filterObj } from './../resources/helpers';
import { Response, NextFunction } from 'express';
import UserModel from '../models/UserModel';
import { RequestCustom } from '../types';
import { createSendToken } from './AuthController';
import {
  deleteOne,
  updateOne,
  createOne,
  getAll,
  getOne,
} from './HandlerFactory';

export const getAllUsers = getAll(UserModel);

export const getUser = getOne(UserModel, 'id');

export const updateUser = updateOne(UserModel);

export const deleteUser = deleteOne(UserModel);

export const createUser = createOne(UserModel);

export const getMe = (
  req: RequestCustom,
  _res: Response,
  next: NextFunction
) => {
  req.params.id = req.user.id;
  next();
};

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
