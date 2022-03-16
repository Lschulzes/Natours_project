import { protect, restrictTo } from './../controllers/AuthController';
import {
  createReview,
  deleteReview,
  getAllReviews,
  getTourReview,
  setTourAndUserIds,
  updateReview,
} from './../controllers/ReviewController';
import { Router } from 'express';
import { UserRoles } from '../resources/helpers';

const router = Router({ mergeParams: true });

router.use(protect);

router.route(`/`).get(getAllReviews).post(setTourAndUserIds, createReview);
router
  .route(`/:id`)
  .get(getTourReview)
  .patch(restrictTo(UserRoles.USER, UserRoles.ADMIN), updateReview)
  .delete(restrictTo(UserRoles.USER, UserRoles.ADMIN), deleteReview);

export default router;
