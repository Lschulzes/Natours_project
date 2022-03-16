import { protect } from './../controllers/AuthController';
import {
  createReview,
  deleteReview,
  getAllReviews,
  getTourReview,
  setTourAndUserIds,
  updateReview,
} from './../controllers/ReviewController';
import { Router } from 'express';

const router = Router({ mergeParams: true });

router
  .route(`/`)
  .get(getAllReviews)
  .post(protect, setTourAndUserIds, createReview);
router
  .route(`/:id`)
  .get(getTourReview)
  .patch(updateReview)
  .delete(protect, deleteReview);

export default router;
