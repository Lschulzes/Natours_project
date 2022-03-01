import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import * as fs from 'fs';
import UserModel from '../models/UserModel';

export const updateFile = (data: any, callback: any) => {
  fs.writeFile(`${__dirname}/dev-data/data/tours-simple.json`, data, callback);
};

export type ToursType = {
  id: number;
  name: string;
  startLocation: string;
  nextStartDate: string;
  duration: number;
  maxGroupSize: number;
  difficulty: string;
  avgRating: number;
  numReviews: number;
  regPrice: number;
  shortDescription: string;
  longDescription: string;
};

export const TOURS_ENDPOINT = '/api/v1/tours';
export const USERS_ENDPOINT = '/api/v1/users';

export class AppError extends Error {
  public status: string;
  public isOperational: boolean;
  constructor(message: string, public statusCode: number) {
    super(message);
    this.status = `${statusCode}`.charAt(0) === '4' ? 'fail' : 'error';
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

export const catchAsync = (fn: any) => {
  return (req: Request, res: Response, next: NextFunction) =>
    fn(req, res, next).catch(next);
};

export const hasExpired = (tokenDate: number) =>
  tokenDate > new Date().getTime();

export const getUserWithToken = async (token: string) => {
  const tokenInfo: any = jwt.decode(token);

  if (!tokenInfo?.exp)
    throw new AppError('The token is either missing or unadequate.', 400);

  if (hasExpired(tokenInfo.exp)) throw new AppError('Token has expired', 400);

  const user = await UserModel.findOne({ _id: tokenInfo.id });
  if (!user) throw new AppError(`Invalid token`, 401);
  return user;
};
