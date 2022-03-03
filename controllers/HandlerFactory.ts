import { NextFunction, Request, Response } from 'express';
import { Model } from 'mongoose';
import { catchAsync, AppError } from '../resources/helpers';

export const deleteOne = (Model: Model<any>) =>
  catchAsync(async (req: Request, res: Response, _next: NextFunction) => {
    const document = await Model.findByIdAndDelete(req.params.id);

    if (!document) throw new AppError(`ID (${req.params.id}) not found!`, 404);

    res.status(204).json({
      status: 'success',
      data: null,
    });
  });
