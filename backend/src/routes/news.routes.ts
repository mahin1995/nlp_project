import { Router } from 'express';
import { getRecommendations } from '../controllers/news.controller';
import { getRecommendationsV2 } from '../controllers/news.controller.v2';

const router = Router();

router.post('/recommend', getRecommendations);
router.post('/recommend/v2', getRecommendationsV2);

export default router;
