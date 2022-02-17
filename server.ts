import dotenv from 'dotenv';
import mongoose from 'mongoose';
dotenv.config({ path: './config.env' });
import app from '.';

const DB = process.env.DATABASE!.replace(
  '<PASSWORD>',
  process.env.DB_PASSWORD as string
);

mongoose.connect(DB).then(() => console.log('DB connection successful'));

app.listen(process.env.PORT, () => {
  console.log(`App running on port ${process.env.PORT}...`);
});
