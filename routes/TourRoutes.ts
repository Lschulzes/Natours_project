import { protect, restrictTo } from './../controllers/AuthController';
import {
  getTourStats,
  getMonthlyPlan,
  getToursWithin,
} from './../controllers/TourController';
import { addTop5CheapParam } from './../middlewares/index';
import express from 'express';
import {
  getAllTours,
  createTour,
  getTour,
  updateTour,
  deleteTour,
} from '../controllers/TourController';
import ReviewRouter from './ReviewRoutes';
import { TOUR_REVIEWS_ENDPOINT, UserRoles } from '../resources/helpers';

const router = express.Router();

router.route('/top-5-cheap').get(addTop5CheapParam, getAllTours);

router.route('/tour-stats').get(getTourStats);
router
  .route('/monthly-plan/:year')
  .get(
    protect,
    restrictTo(UserRoles.ADMIN, UserRoles.LEAD_GUIDE, UserRoles.GUIDE),
    getMonthlyPlan
  );

router
  .route('/tours-within/:distance/center/:latlng/unit/:unit')
  .get(getToursWithin);

router
  .route(`/`)
  .get(getAllTours)
  .post(protect, restrictTo(UserRoles.ADMIN, UserRoles.LEAD_GUIDE), createTour);
router
  .route(`/:id`)
  .get(getTour)
  .patch(protect, updateTour)
  .delete(
    protect,
    restrictTo(UserRoles.ADMIN, UserRoles.LEAD_GUIDE),
    deleteTour
  );

router.use(`${TOUR_REVIEWS_ENDPOINT}`, ReviewRouter);

export default router;
