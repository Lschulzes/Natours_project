import { catchAsync } from './../resources/helpers';
import { Request, Response } from 'express';
import TourModel from '../models/TourModel';

export const getOverview = catchAsync(async (_req: Request, res: Response) => {
  const tours = await TourModel.find();

  res.status(200).render('overview', {
    title: 'All Tours',
    tours,
  });
});

export const getTour = catchAsync(async (req: Request, res: Response) => {
  const { tourSlug } = req.params;

  const [tour] = await TourModel.find({ slug: tourSlug });

  res.status(200).render('tour', {
    title: 'The Snow Explorerer',
    tour,
  });
});
