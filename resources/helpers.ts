import * as fs from 'fs';

export const updateFile = (data: any, callback: any) => {
  fs.writeFile(`${__dirname}/dev-data/data/tours-simple.json`, data, callback);
};

export type ToursType = {
  id: number;
  name: string;
  startLocation: string;
  nextStartDate: string;
  duration: number;
  maxGroupSize: number;
  difficulty: string;
  avgRating: number;
  numReviews: number;
  regPrice: number;
  shortDescription: string;
  longDescription: string;
};

export const TOURS_ENDPOINT = '/api/v1/tours';
export const USERS_ENDPOINT = '/api/v1/users';
