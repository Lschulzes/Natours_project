import { NextFunction, Response } from 'express';
import express from 'express';
import { RequestCustom } from './types';
import morgan from 'morgan';
import { TOURS_ENDPOINT, USERS_ENDPOINT, AppError } from './resources/helpers';
import tourRouter from './routes/TourRoutes';
import userRouter from './routes/UserRoutes';
import { errorHandler } from './controllers/ErrorController';

const app = express();
if (process.env.NODE_ENV === 'development') app.use(morgan('dev'));

app.use(express.json());
app.use(express.static(`${__dirname}/public`));

app.use((req: RequestCustom, _res: Response, next: NextFunction) => {
  req.requestTime = new Date().toISOString();
  next();
});

app.use(`${TOURS_ENDPOINT}`, tourRouter);

app.use(`${USERS_ENDPOINT}`, userRouter);

app.all('*', (req: RequestCustom, _res: Response, next: NextFunction) => {
  const err = new AppError(`Can't find ${req.originalUrl} on this server`, 404);

  next(err);
});

app.use(errorHandler);

export default app;
