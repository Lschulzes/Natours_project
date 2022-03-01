import { signup, signout, login } from './../controllers/AuthController';
import express from 'express';
import {
  getAllUsers,
  createUser,
  getUser,
  updateUser,
  deleteUser,
} from '../controllers/UserController';

const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);
router.post('/signout', signout);

router.route(`/`).get(getAllUsers).post(createUser);
router.route(`/:id`).get(getUser).patch(updateUser).delete(deleteUser);

export default router;
