import { ErrorRequestHandler, NextFunction, Response } from 'express';
import express from 'express';
import { RequestCustom } from './custom_types';
import morgan from 'morgan';
import { TOURS_ENDPOINT, USERS_ENDPOINT } from './resources/helpers';
import tourRouter from './routes/TourRoutes';
import userRouter from './routes/UserRoutes';
import ErrorController from './controllers/ErrorController';

const app = express();
if (process.env.NODE_ENV === 'development') app.use(morgan('dev'));

app.use(express.json());
app.use(express.static(`${__dirname}/public`));

app.use((req: RequestCustom, res: Response, next: NextFunction) => {
  req.requestTime = new Date().toISOString();
  next();
});

app.use(`${TOURS_ENDPOINT}`, tourRouter);

app.use(`${USERS_ENDPOINT}`, userRouter);

app.all('*', (req: RequestCustom, res: Response, next: NextFunction) => {
  const err = new ErrorController(
    `Can't find ${req.originalUrl} on this server`,
    404
  );

  next(err);
});

app.use(
  (
    err: ErrorController,
    req: RequestCustom,
    res: Response,
    next: NextFunction
  ) => {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  }
);

export default app;
