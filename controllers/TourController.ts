import { Request, Response } from 'express';
import { RequestCustom } from '../custom_types';
import TourModel from '../models/TourModel';
import { APIFeatures } from '../resources/apis';

export const getAllTours = async (req: Request, res: Response) => {
  try {
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
  } catch (error) {
    res.status(404).json({
      status: 'failed',
      message: error,
    });
  }
};

export const getTour = async (req: RequestCustom, res: Response) => {
  try {
    const id = req.params.id;
    const tour = await TourModel.findById(id);
    console.log(req?.requestTime);
    res.status(200).json({
      status: 'success',
      requestedAt: req.requestTime,
      data: { tour },
    });
  } catch (error) {
    res.status(404).json({
      status: 'failed',
      message: error,
    });
  }
};

export const createTour = async (req: Request, res: Response) => {
  try {
    const newTour = await TourModel.create(req.body);
    res.status(201).json({
      status: 'success',
      data: {
        tour: newTour,
      },
    });
  } catch (error) {
    res.status(403).json({
      status: 'failed',
      message: error,
    });
  }
};

export const updateTour = async (req: Request, res: Response) => {
  try {
    const tour = await TourModel.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      status: 'success',
      tour,
    });
  } catch (error) {
    res.status(403).json({
      status: 'failed',
      message: error,
    });
  }
};

export const deleteTour = async (req: Request, res: Response) => {
  try {
    await TourModel.findByIdAndDelete(req.params.id);

    res.status(204).json({
      status: 'success',
      data: null,
    });
  } catch (error) {
    res.status(403).json({
      status: 'failed',
      message: error,
    });
  }
};

export const getTourStats = async (req: RequestCustom, res: Response) => {
  try {
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
  } catch (error) {
    res.status(403).json({
      status: 'failed',
      message: error,
    });
  }
};

export const getMonthlyPlan = async (req: RequestCustom, res: Response) => {
  try {
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
  } catch (error) {
    res.status(403).json({
      status: 'failed',
      message: error,
    });
  }
};
