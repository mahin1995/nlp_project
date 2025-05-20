import { Router } from 'express';
import {
  getAll,
  getAllByCategory,
  getById,
  getHomePageData,
  getRecommendations,
} from '../controllers/news.controller';
import { getRecommendationsV2 } from '../controllers/news.controller.v2';

const router = Router();

router.post('/recommend', getRecommendations);
router.post('/recommend/v2', getRecommendationsV2);
/**
 * @swagger
 * /api/news/all:
 *   get:
 *     tags:
 *       - News
 *     summary: Get all news items
 *     description: Returns a list news item based on its unique identifier
 *     responses:
 *       200:
 *         description: Successfully retrieved news item list
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/News'
 *       404:
 *         description: News item not found
 *       500:
 *         description: Server error
 */
router.get('/all', getAll);
/**
 * @swagger
 * /api/news/all-by-category:
 *   get:
 *     tags:
 *       - News
 *     summary: Get all news items by category
 *     description: Returns a list news item based on its unique identifier
 *     responses:
 *       200:
 *         description: Successfully retrieved news item list
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/News'
 *       404:
 *         description: News item not found
 *       500:
 *         description: Server error
 */
router.get('/all-by-category', getAllByCategory);
/**
 * @swagger
 * /api/news/home:
 *   get:
 *     tags:
 *       - News
 *     summary: Get all news items by category
 *     description: Returns a list news item based on its unique identifier
 *     responses:
 *       200:
 *         description: Successfully retrieved news item list
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/News'
 *       404:
 *         description: News item not found
 *       500:
 *         description: Server error
 */
router.get('/home', getHomePageData);
/**
 * @swagger
 * /api/news/get-by-id/{id}:
 *   get:
 *     tags:
 *       - News
 *     summary: Get a specific news item by ID
 *     description: Returns a single news item based on its unique identifier
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *           example: "642a1b2c3d4e5f6a7b8c9d0e"
 *         required: true
 *         description: MongoDB ID of the news item to retrieve
 *     responses:
 *       200:
 *         description: Successfully retrieved news item
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/News'
 *       404:
 *         description: News item not found
 *       500:
 *         description: Server error
 */
router.get('/get-by-id/:id', getById);

export default router;
