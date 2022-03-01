import { catchAsync } from './../resources/helpers';
import { Request, Response, NextFunction } from 'express';
import UserModel from '../models/UserModel';

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
