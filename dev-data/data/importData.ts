import dotenv from 'dotenv';
import fs from 'fs';
import mongoose from 'mongoose';
import ReviewModel from '../../models/ReviewModel';
import TourModel from '../../models/TourModel';
import UserModel from '../../models/UserModel';

dotenv.config({ path: '../../config.env' });

const DB = process.env.DATABASE!.replace(
  '<PASSWORD>',
  process.env.DB_PASSWORD as string
);

mongoose.connect(DB).then(() => console.log('DB connection successful'));
const tours = JSON.parse(fs.readFileSync(`${__dirname}/tours.json`, 'utf-8'));
const users = JSON.parse(fs.readFileSync(`${__dirname}/users.json`, 'utf-8'));
const reviews = JSON.parse(
  fs.readFileSync(`${__dirname}/reviews.json`, 'utf-8')
);

const importData = async () => {
  try {
    await TourModel.create(tours);
    await UserModel.create(users, { validateBeforeSave: false });
    await ReviewModel.create(reviews);
    console.log('Data Successfully Imported');
    process.exit();
  } catch (error) {
    console.error(error);
  }
};

const deleteAllData = async () => {
  try {
    await TourModel.deleteMany();
    await UserModel.deleteMany();
    await ReviewModel.deleteMany();
    console.log('Data Successfully Deleted');
    process.exit();
  } catch (error) {
    console.error(error);
  }
};

if (process.argv[2] === '--import') importData();
if (process.argv[2] === '--delete') deleteAllData();
