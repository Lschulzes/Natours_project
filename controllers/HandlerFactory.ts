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

export const updateOne = (Model: Model<any>) =>
  catchAsync(async (req: Request, res: Response, _next: NextFunction) => {
    const document = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!document) throw new AppError(`ID (${req.params.id}) not found!`, 404);
    const modelName = Model.collection.collectionName;
    const data = Object.fromEntries([`${modelName}`, document]);
    console.log(data);
    res.status(200).json({
      status: 'success',
      data: { data },
    });
  });

export const createOne = (Model: Model<any>) =>
  catchAsync(async (req: Request, res: Response, _next: NextFunction) => {
    const document = await Model.create(req.body);

    res.status(201).json({
      status: 'success',
      data: document,
    });
  });
