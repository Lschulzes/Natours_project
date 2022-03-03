import { protect } from './../controllers/AuthController';
import {
  createReview,
  getAllReviews,
  getTourReview,
} from './../controllers/ReviewController';
import { Router } from 'express';

const router = Router({ mergeParams: true });

router.route(`/`).get(getAllReviews).post(protect, createReview);
router.route(`/:id`).get(getTourReview);
// .patch(protect, updateTour)
// .delete(protect, restrictTo('admin', 'lead-guide'), deleteTour);

export default router;
