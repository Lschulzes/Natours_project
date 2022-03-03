import { protect } from './../controllers/AuthController';
import {
  createReview,
  deleteReview,
  getAllReviews,
  getTourReview,
  updateReview,
} from './../controllers/ReviewController';
import { Router } from 'express';

const router = Router({ mergeParams: true });

router.route(`/`).get(getAllReviews).post(protect, createReview);
router
  .route(`/:id`)
  .get(getTourReview)
  .patch(updateReview)
  .delete(protect, deleteReview);

export default router;
