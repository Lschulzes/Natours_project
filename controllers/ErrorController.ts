import { NextFunction, Response } from 'express';
import { RequestCustom } from '../custom_types';
import { AppError } from './../resources/helpers';

export const errorHandler = (
  err: AppError,
  req: RequestCustom,
  res: Response,
  next: NextFunction
) => {
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
  });
};
