process.on('uncaughtException', (err: Error) => {
  console.log('UNCAUGHT EXCEPTION! 🧨 SHUTTING DOWN!');
  console.log(`${err}`);
  process.exit(1);
});

import dotenv from 'dotenv';
import mongoose from 'mongoose';
dotenv.config({ path: './config.env' });
import app from '.';

const DB = process.env.DATABASE!.replace(
  '<PASSWORD>',
  process.env.DB_PASSWORD as string
);

mongoose.connect(DB).then(() => console.log('DB connection successful'));

const server = app.listen(process.env.PORT, () => {
  console.log(`App running on port ${process.env.PORT}...`);
});

process.on('unhandledRejection', (err: Error) => {
  console.log(`Name: ${err.name}`);
  console.log(`Message: ${err.message}`);
  console.log('UNHANDLED REJECTION! 🧨 SHUTTING DOWN!');
  server.close(() => process.exit(1));
});
