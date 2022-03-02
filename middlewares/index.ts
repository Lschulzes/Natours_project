import { NextFunction, Response } from 'express';
import rateLimit from 'express-rate-limit';
import { RequestCustom } from '../types';

export const addTop5CheapParam = (
  req: RequestCustom,
  _res: Response,
  next: NextFunction
) => {
  req.query.limit = '5';
  req.query.sort = 'price,-ratingAverage';
  req.query.fields = 'name,price,ratingAverage,summary,difficulty';
  next();
};

export const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'Too many requests from this IP, please try again in an hour.',
});
