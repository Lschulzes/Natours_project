import { catchAsync } from './../resources/helpers';
import { Request, Response, NextFunction } from 'express';
import UserModel from '../models/UserModel';

export const getAllUsers = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {}
);

export const getUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {}
);

export const updateUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {}
);

export const deleteUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {}
);

export const createUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = await UserModel.create(req.body);

    res.status(201).json({
      status: 'success',
      data: { user },
    });
  }
);
