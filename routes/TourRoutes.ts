import { getTourStats, getMonthlyPlan } from './../controllers/TourController';
import { addTop5CheapParam, checkIfHasTour } from './../middlewares/index';
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

router.param('id', checkIfHasTour);

router.route(`/`).get(getAllTours).post(createTour);
router.route(`/:id`).get(getTour).patch(updateTour).delete(deleteTour);

export default router;
