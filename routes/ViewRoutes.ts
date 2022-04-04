import { getTour, getOverview } from './../controllers/ViewController';
import { Router } from 'express';

const router = Router();

router.get('/', getOverview);

router.get('/tours', getOverview);
router.get('/tours/:tourSlug', getTour);

export default router;
