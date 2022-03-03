import { NextFunction, Request, Response } from 'express';
import ReviewModel from '../models/ReviewModel';
import { catchAsync, filterObj } from '../resources/helpers';
import { RequestCustom } from '../types';
import { deleteOne } from './HandlerFactory';

export const getAllReviews = catchAsync(
  async (req: Request, res: Response, _next: NextFunction) => {
    const { tourId } = req.params;
    const filter: any = {};
    if (tourId) filter.tour = tourId;

    const reviews = await ReviewModel.find(filter).populate('user');

    res.status(200).json({
      status: 'success',
      results: reviews.length,
      data: { reviews },
    });
  }
);

export const getTourReview = catchAsync(
  async (req: Request, res: Response, _next: NextFunction) => {
    const { tourId } = req.params;
    const { id } = req.params;

    const reviews = await ReviewModel.find({ _id: id, tour: tourId }).populate(
      'user'
    );

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

export const deleteReview = deleteOne(ReviewModel);
