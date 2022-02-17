import { NextFunction, Response } from 'express';
import express from 'express';
import { RequestCustom } from './custom_types';
import morgan from 'morgan';
import { TOURS_ENDPOINT, USERS_ENDPOINT } from './resources/helpers';
import tourRouter from './routes/TourRoutes';
import userRouter from './routes/UserRoutes';

const app = express();
if (process.env.NODE_ENV === 'development') app.use(morgan('dev'));

app.use(express.json());
console.log(`${__dirname}/public/`);
app.use(express.static(`${__dirname}/public`));

app.use((req: RequestCustom, res: Response, next: NextFunction) => {
  req.requestTime = new Date().toISOString();
  next();
});

app.use(`${TOURS_ENDPOINT}`, tourRouter);

app.use(`${USERS_ENDPOINT}`, userRouter);

export default app;
