import { NextFunction, Response } from 'express';
import ReviewModel from '../models/ReviewModel';
import { RequestCustom } from '../types';
import {
  deleteOne,
  updateOne,
  createOne,
  getAll,
  getOne,
} from './HandlerFactory';

export const setTourAndUserIds = (
  req: RequestCustom,
  _res: Response,
  next: NextFunction
) => {
  req.body.user = req.user.id;
  req.body.tour = req.params.tourId;

  next();
};

export const getTourReview = getOne(ReviewModel, [['_id', 'id']], ['user']);

export const getAllReviews = getAll(
  ReviewModel,
  [['tour', 'tourId']],
  ['user']
);

export const createReview = createOne(ReviewModel);

export const updateReview = updateOne(ReviewModel);

export const deleteReview = deleteOne(ReviewModel);
