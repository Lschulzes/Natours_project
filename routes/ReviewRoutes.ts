import { protect } from './../controllers/AuthController';
import {
  createReview,
  getTourReviews,
} from './../controllers/ReviewController';
import { Router } from 'express';

const router = Router({ mergeParams: true });

router.route(`/`).get(getTourReviews).post(protect, createReview);
// router
//   .route(`/:id`)
//   .get(getTour)
//   .patch(protect, updateTour)
//   .delete(protect, restrictTo('admin', 'lead-guide'), deleteTour);

export default router;
