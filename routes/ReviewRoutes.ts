import { protect } from './../controllers/AuthController';
import { createReview, getAllReviews } from './../controllers/ReviewController';
import { Router } from 'express';

const router = Router();

router.route(`/`).get(getAllReviews).post(protect, createReview);
// router
//   .route(`/:id`)
//   .get(getTour)
//   .patch(protect, updateTour)
//   .delete(protect, restrictTo('admin', 'lead-guide'), deleteTour);

export default router;
