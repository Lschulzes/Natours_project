import { NextFunction, Response } from 'express';
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
