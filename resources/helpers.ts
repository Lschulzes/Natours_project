import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import * as fs from 'fs';
import UserModel from '../models/UserModel';
import { promisify } from 'util';
import { JWTLoginType } from '../types';

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

const API_ENDPOINT = '/api/v1';
export const TOURS_ENDPOINT = `${API_ENDPOINT}/tours`;
export const USERS_ENDPOINT = `${API_ENDPOINT}/users`;
export const REVIEWS_ENDPOINT = `${API_ENDPOINT}/reviews`;
export const TOUR_REVIEWS_ENDPOINT = `/:tourId/reviews`;

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

export const getTokenInfo = async <T>(token: string): Promise<T> => {
  return (await promisify(jwt.verify)(
    token,
    // @ts-ignore
    process.env.JWT_SECRET
  )) as unknown as T;
};

export const getUserWithToken = async (token: string) => {
  const tokenInfo = await getTokenInfo<JWTLoginType>(token);
  const user = await UserModel.findOne({ _id: tokenInfo.id });

  if (!user) throw new AppError(`User no longer exists!`, 401);
  return user;
};

export const filterObj = (obj: any, ...fields: string[]) => {
  const newObj: any = {};
  fields.forEach((field) => (newObj[field] = obj[field]));
  return newObj;
};

export enum UserRoles {
  ADMIN = 'admin',
  USER = 'user',
  GUIDE = 'guide',
  LEAD_GUIDE = 'lead-guide',
}

export const whitelist = [
  'duration',
  'ratingsQuantity',
  'ratingAverage',
  'maxGroupSize',
  'difficulty',
  'price',
];
