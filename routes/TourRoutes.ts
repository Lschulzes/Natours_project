import { protect, restrictTo } from './../controllers/AuthController';
import { getTourStats, getMonthlyPlan } from './../controllers/TourController';
import { addTop5CheapParam } from './../middlewares/index';
import express from 'express';
import {
  getAllTours,
  createTour,
  getTour,
  updateTour,
  deleteTour,
} from '../controllers/TourController';

const router = express.Router();

router.route('/top-5-cheap').get(addTop5CheapParam, getAllTours);

router.route('/tour-stats').get(getTourStats);
router.route('/monthly-plan/:year').get(getMonthlyPlan);

router.route(`/`).get(protect, getAllTours).post(protect, createTour);
router
  .route(`/:id`)
  .get(getTour)
  .patch(protect, updateTour)
  .delete(protect, restrictTo('admin', 'lead-guide'), deleteTour);

export default router;
