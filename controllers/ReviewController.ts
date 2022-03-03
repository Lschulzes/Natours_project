import { NextFunction, Request, Response } from 'express';
import ReviewModel from '../models/ReviewModel';
import { catchAsync, filterObj } from '../resources/helpers';
import { RequestCustom } from '../types';

export const getAllReviews = catchAsync(
  async (_req: Request, res: Response, _next: NextFunction) => {
    const reviews = await ReviewModel.find();

    res.status(200).json({
      status: 'success',
      data: { reviews },
    });
  }
);

export const createReview = catchAsync(
  async (req: RequestCustom, res: Response, _next: NextFunction) => {
    console.log(req.body.user);
    const reviewInfo = filterObj(req.body, 'review', 'rating', 'tour');
    reviewInfo.user = req.user.id;
    const review = await ReviewModel.create(reviewInfo);

    res.status(201).json({
      status: 'success',
      data: { review },
    });
  }
);
