import { catchAsync, AppError } from './../resources/helpers';
import { Response, NextFunction } from 'express';
import { RequestCustom } from '../types';
import TourModel from '../models/TourModel';
import {
  deleteOne,
  updateOne,
  createOne,
  getAll,
  getOne,
} from './HandlerFactory';

export const getAllTours = getAll(TourModel);

export const getTour = getOne(TourModel, [['_id', 'id']]);

export const createTour = createOne(TourModel);

export const updateTour = updateOne(TourModel);

export const deleteTour = deleteOne(TourModel);

export const getToursWithin = catchAsync(
  async (req: RequestCustom, res: Response, _next: NextFunction) => {
    const { distance, latlng, unit } = req.params;
    const [lat, lng] = latlng.split(',');

    if (isNaN(+distance)) throw new AppError('Within must be a number.', 400);

    const radius = unit === 'mi' ? +distance / 3963.2 : +distance / 6378.1;

    if (!lat || !lng)
      throw new AppError(
        'Please provide latitude and longitude in the following format: lat,lng',
        400
      );

    const tours = await TourModel.find({
      startLocation: {
        $geoWithin: {
          $centerSphere: [[lng, lat], radius],
        },
      },
    });

    res.status(200).json({
      status: 'success',
      results: tours.length,
      data: {
        tours,
      },
    });
  }
);
export const getTourStats = catchAsync(
  async (_req: RequestCustom, res: Response, _next: NextFunction) => {
    const stats = await TourModel.aggregate([
      { $match: { ratingAverage: { $gte: 4 } } },
      {
        $group: {
          _id: { $toUpper: '$difficulty' },
          numTours: { $count: {} },
          numRatings: { $sum: '$ratingQuantity' },
          avgRating: { $avg: '$ratingAverage' },
          avgPrice: { $avg: '$price' },
          minPrice: { $min: '$price' },
          maxPrice: { $max: '$price' },
          avgDuration: { $avg: '$duration' },
        },
      },
      { $sort: { avgPrice: -1 } },
    ]);

    res.status(200).json({
      status: ' success',
      data: stats,
    });
  }
);

export const getMonthlyPlan = catchAsync(
  async (req: RequestCustom, res: Response, _next: NextFunction) => {
    const year = +req.params.year;

    const plan = await TourModel.aggregate([
      {
        $unwind: '$startDates',
      },
      {
        $match: {
          startDates: {
            $gte: new Date(`${year}-01-01`),
            $lte: new Date(`${year}-12-31`),
          },
        },
      },
      {
        $group: {
          _id: { $month: '$startDates' },
          numTours: { $count: {} },
          tours: { $push: '$name' },
        },
      },
      { $addFields: { month: '$_id' } },
      { $project: { _id: 0 } },
      { $sort: { numTours: -1 } },
    ]);

    res.status(200).json({
      status: ' success',
      data: plan,
    });
  }
);
