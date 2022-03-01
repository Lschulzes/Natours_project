import { NextFunction, Response } from 'express';
import { RequestCustom } from '../types';

export const checkIfHasTour = (
  _req: RequestCustom,
  res: Response,
  next: NextFunction,
  id: any,
  _name: string
) => {
  console.log(`Tour id: ${id}`);
  if (false) {
    return res.status(404).json({
      status: 'fail',
      message: `No tour found with the id of ${id}`,
    });
  }
  next();
};

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
