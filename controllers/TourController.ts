import { Request, Response, NextFunction, ErrorRequestHandler } from 'express';
import { RequestCustom } from '../custom_types';
import TourModel from '../models/TourModel';
import { APIFeatures } from '../resources/apis';

const catchAsync = (fn: any) => {
  return (req: Request, res: Response, next: NextFunction) =>
    fn(req, res, next).catch(next);
};

export const getAllTours = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
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
  async (req: RequestCustom, res: Response, next: NextFunction) => {
    const id = req.params.id;
    const tour = await TourModel.findById(id);
    console.log(req?.requestTime);
    res.status(200).json({
      status: 'success',
      requestedAt: req.requestTime,
      data: { tour },
    });
  }
);

export const createTour = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
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
  async (req: Request, res: Response, next: NextFunction) => {
    const tour = await TourModel.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      status: 'success',
      tour,
    });
  }
);

export const deleteTour = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    await TourModel.findByIdAndDelete(req.params.id);

    res.status(204).json({
      status: 'success',
      data: null,
    });
  }
);

export const getTourStats = catchAsync(
  async (req: RequestCustom, res: Response, next: NextFunction) => {
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
  async (req: RequestCustom, res: Response, next: NextFunction) => {
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
