import { Router } from 'express';
import {
  getAll,
  getAllByCategory,
  getHomePageData,
  getRecommendations,
} from '../controllers/news.controller';
import { getRecommendationsV2 } from '../controllers/news.controller.v2';

const router = Router();

router.post('/recommend', getRecommendations);
router.post('/recommend/v2', getRecommendationsV2);
router.get('/all', getAll);
router.get('/all-by-category', getAllByCategory);
router.get('/home', getHomePageData);

export default router;
