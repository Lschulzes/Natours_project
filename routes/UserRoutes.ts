import { getMe } from './../controllers/UserController';
import {
  signup,
  signout,
  login,
  forgotPassword,
  resetPassword,
  updatePassword,
  protect,
} from './../controllers/AuthController';
import express from 'express';
import {
  getAllUsers,
  createUser,
  getUser,
  updateUser,
  deleteUser,
  updateMe,
  deleteMe,
} from '../controllers/UserController';

const router = express.Router({ mergeParams: true });

router.get('/me', protect, getMe, getUser);
router.post('/signup', signup);
router.post('/login', login);
router.post('/signout', signout);
router.post('/forgotPassword', forgotPassword);
router.patch('/resetPassword/:token', resetPassword);
router.patch('/updatePassword', protect, updatePassword);
router.patch('/updateMe', protect, updateMe);
router.delete('/deleteMe', protect, deleteMe);

router.route(`/`).get(getAllUsers).post(createUser);
router.route(`/:id`).get(getUser).patch(updateUser).delete(deleteUser);

export default router;
