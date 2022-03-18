import { NextFunction, Request, Response } from 'express';
import { Model } from 'mongoose';
import { APIFeatures } from '../resources/apis';
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

export const getAll = (
  Model: Model<any>,
  filters?: [objKey: string, value: string][],
  populate?: string[]
) => getOneOrMore(Model, filters, populate);

export const getOne = (
  Model: Model<any>,
  filters?: [objKey: string, value: string][],
  populate?: string[]
) => getOneOrMore(Model, filters, populate);

const getOneOrMore = (
  Model: Model<any>,
  filters?: [objKey: string, value: string][],
  populate?: string[]
) =>
  catchAsync(async (req: Request, res: Response, _next: NextFunction) => {
    const filter =
      filters?.reduce((prev, cur) => {
        prev[cur[0]] = req.params[cur[1]];
        return prev;
      }, {}) ?? {};

    const features = new APIFeatures(
      Model.find(filter).populate(populate),
      req.query
    )
      .filter()
      .sort()
      .paginate()
      .limitFields();

    const doc = await features.query;
    res.status(200).json({
      status: 'success',
      results: doc.length,
      data: { doc },
    });
  });
