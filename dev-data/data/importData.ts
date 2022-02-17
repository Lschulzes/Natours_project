import dotenv from 'dotenv';
import fs from 'fs';
import mongoose from 'mongoose';
import TourModel from '../../models/TourModel';

dotenv.config({ path: '../../config.env' });

const DB = process.env.DATABASE!.replace(
  '<PASSWORD>',
  process.env.DB_PASSWORD as string
);

mongoose.connect(DB).then(() => console.log('DB connection successful'));
const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/tours-simple.json`, 'utf-8')
);

const importData = async () => {
  try {
    await TourModel.create(tours);
    console.log('Data Successfully Imported');
    process.exit();
  } catch (error) {
    console.error(error);
  }
};

const deleteAllData = async () => {
  try {
    await TourModel.deleteMany();
    console.log('Data Successfully Deleted');
    process.exit();
  } catch (error) {
    console.error(error);
  }
};

if (process.argv[2] === '--import') importData();
if (process.argv[2] === '--delete') deleteAllData();
