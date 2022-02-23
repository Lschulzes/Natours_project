import { ErrorRequestHandler, NextFunction, Response } from 'express';
import { Error } from 'mongoose';
import { RequestCustom } from '../custom_types';
import { AppError } from './../resources/helpers';

const handleCastErrorDB = (err: Error.CastError): AppError => {
  const message = `Invalid ${err.path}: ${err.value}.`;
  return new AppError(message, 400);
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

  if (process.env.NODE_ENV === 'development') sendErrorDev(err, res);
  else {
    let error = { ...err };
    if (err.name === 'CastError') error = handleCastErrorDB(err);
    sendErrorProd(error, res);
  }
};
