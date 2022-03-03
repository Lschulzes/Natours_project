import { limiter } from './middlewares/index';
import { NextFunction, Response } from 'express';
import express from 'express';
import { RequestCustom } from './types';
import morgan from 'morgan';
import {
  TOURS_ENDPOINT,
  USERS_ENDPOINT,
  REVIEWS_ENDPOINT,
  AppError,
  whitelist,
} from './resources/helpers';
import tourRouter from './routes/TourRoutes';
import userRouter from './routes/UserRoutes';
import reviewsRouter from './routes/ReviewRoutes';
import { errorHandler } from './controllers/ErrorController';
import helmet from 'helmet';
import mongoSanitize from 'express-mongo-sanitize';
import xss from 'xss-clean';
import hpp from 'hpp';

const app = express();

app.use(helmet());

if (process.env.NODE_ENV === 'development') app.use(morgan('dev'));

app.use('/api', limiter);
app.use(express.json({ limit: '10kb' }));
app.use(express.static(`${__dirname}/public`));

app.use(mongoSanitize());
app.use(xss());
app.use(hpp({ whitelist }));

app.use(`${TOURS_ENDPOINT}`, tourRouter);

app.use(`${USERS_ENDPOINT}`, userRouter);

app.use(`${REVIEWS_ENDPOINT}`, reviewsRouter);

app.all('*', (req: RequestCustom, _res: Response, next: NextFunction) => {
  const err = new AppError(`Can't find ${req.originalUrl} on this server`, 404);

  next(err);
});

app.use(errorHandler);

export default app;
