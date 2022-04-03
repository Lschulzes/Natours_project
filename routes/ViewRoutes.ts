import { getOverview, getTour } from './../controllers/ViewController';
import { Router } from 'express';

const router = Router();

router.get('/', getOverview);

router.get('/tour', getTour);

export default router;
