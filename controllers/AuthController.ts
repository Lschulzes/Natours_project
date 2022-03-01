import { createUser } from './UserController';
import { catchAsync } from './../resources/helpers';
import { Request, Response, NextFunction } from 'express';
import UserModel from '../models/UserModel';

export const signup = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    await createUser(req, res, next);
  }
);

export const signin = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {}
);

export const signout = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {}
);
