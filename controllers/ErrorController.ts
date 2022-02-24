import { ErrorRequestHandler, NextFunction, Response } from 'express';
import { Error } from 'mongoose';
import { errorMonitor } from 'stream';
import { RequestCustom } from '../custom_types';
import { AppError } from './../resources/helpers';

const handleCastErrorDB = (err: Error.CastError): AppError => {
  const message = `Invalid ${err.path}: ${err.value}.`;
  return new AppError(message, 400);
};

const handleDuplicateFieldsDB = (err: any): AppError => {
  const message = `Duplicated field value: ${err.keyValue.name}. Please use another value`;
  return new AppError(message, 400);
};

const handleMultipleMongooseErrors = (err: any): AppError => {
  const message = Object.values(err.errors).reduce(
    (prev: string, el: any) => `${prev} | ${el.path}:${el.message}`,
    'Multiple errors found:'
  );

  return new AppError(message, err.statusCode);
};

const sendErrorDev = (err: AppError, res: Response) => {
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  });
};

const sendErrorProd = (err: AppError, res: Response) => {
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
    return;
  }

  console.error(`Error ${err}`);

  res.status(500).json({
    status: 'error',
    message: 'Something went very wrong!',
  });
};

export const errorHandler = (
  err: any,
  req: RequestCustom,
  res: Response,
  next: NextFunction
) => {
  err.statusCode = err.statusCode ?? 500;
  err.status = err.status ?? 'error';

  if (process.env.NODE_ENV === 'development') return sendErrorDev(err, res);

  let error = { ...err };

  if (error.name === 'CastError') error = handleCastErrorDB(error);
  if (error.code === 11000) error = handleDuplicateFieldsDB(error);
  if (error?.errors) error = handleMultipleMongooseErrors(error);

  sendErrorProd(error, res);
};
