import { NextFunction, Request, Response } from 'express';
import ReviewModel from '../models/ReviewModel';
import { catchAsync, filterObj } from '../resources/helpers';
import { RequestCustom } from '../types';

export const getTourReviews = catchAsync(
  async (req: Request, res: Response, _next: NextFunction) => {
    const { tourId } = req.params;

    const reviews = await ReviewModel.find({ tour: tourId }).populate('user');

    res.status(200).json({
      status: 'success',
      data: { reviews },
    });
  }
);

export const createReview = catchAsync(
  async (req: RequestCustom, res: Response, _next: NextFunction) => {
    const reviewInfo = filterObj(req.body, 'review', 'rating');
    reviewInfo.user = req.user.id;
    reviewInfo.tour = req.params.tourId;

    const review = await ReviewModel.create(reviewInfo);

    res.status(201).json({
      status: 'success',
      data: { review },
    });
  }
);
