import { AppError, catchAsync } from './../resources/helpers';
import { Request, Response, NextFunction } from 'express';
import { RequestCustom } from '../types';
import TourModel from '../models/TourModel';
import { APIFeatures } from '../resources/apis';

export const getAllTours = catchAsync(
  async (req: Request, res: Response, _next: NextFunction) => {
    const features = new APIFeatures(TourModel.find(), req.query)
      .filter()
      .sort()
      .paginate()
      .limitFields();

    const tours = await features.query;
    res.status(200).json({
      status: 'success',
      results: tours.length,
      data: { tours },
    });
  }
);

export const getTour = catchAsync(
  async (req: RequestCustom, res: Response, _next: NextFunction) => {
    const id = req.params.id;
    const tour = await TourModel.findById(id);

    if (!tour) throw new AppError(`Tour ID (${id}) not found!`, 404);

    res.status(200).json({
      status: 'success',
      data: { tour },
    });
  }
);

export const createTour = catchAsync(
  async (req: Request, res: Response, _next: NextFunction) => {
    const newTour = await TourModel.create(req.body);
    res.status(201).json({
      status: 'success',
      data: {
        tour: newTour,
      },
    });
  }
);

export const updateTour = catchAsync(
  async (req: Request, res: Response, _next: NextFunction) => {
    const tour = await TourModel.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!tour) throw new AppError(`Tour ID (${req.params.id}) not found!`, 404);

    res.status(200).json({
      status: 'success',
      tour,
    });
  }
);

export const deleteTour = catchAsync(
  async (req: Request, res: Response, _next: NextFunction) => {
    const tour = await TourModel.findByIdAndDelete(req.params.id);

    if (!tour) throw new AppError(`Tour ID (${req.params.id}) not found!`, 404);

    res.status(204).json({
      status: 'success',
      data: null,
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
