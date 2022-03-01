import { Query as ModelQuery } from 'mongoose';
import { Query } from '../types';

export class APIFeatures {
  constructor(public query: ModelQuery<any, any>, public queryString: Query) {}

  filter(): this {
    const queryObj = { ...this.queryString };
    const excludedFields = ['page', 'sort', 'limit', 'fields'];
    excludedFields.forEach((el) => delete queryObj[el]);

    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
    this.query.find(JSON.parse(queryStr));
    return this;
  }

  sort(): this {
    if (this.queryString?.sort) {
      const sortBy = (this.queryString.sort as string).split(',').join(' ');
      this.query = this.query.sort(sortBy);
    } else {
      this.query = this.query.sort('-createdAt');
    }
    return this;
  }

  limitFields(): this {
    if (this.queryString?.fields) {
      const fields = (this.queryString.fields as string).split(',').join(' ');
      this.query = this.query.select(fields);
    }
    this.query = this.query.select('-__v');
    return this;
  }

  paginate(): this {
    const page = this.queryString?.page ? +this.queryString.page : 1;
    const limit = this.queryString?.limit ? +this.queryString.limit : 100;
    const skip = (page - 1) * limit;

    this.query = this.query.skip(skip).limit(limit);

    return this;
  }
}
