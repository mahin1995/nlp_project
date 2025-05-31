import { Router } from 'express';
import { getAllCategory, getCategoryDetailsByLink } from '../controllers/category.controller';

const router = Router();

router.get('/', getAllCategory);
/**
 * @swagger
 * /api/category/get-by-link/{link}:
 *   get:
 *     tags:
 *       - Category
 *     summary: Get category details by link
 *     description: Returns category details based on the provided link
 *     parameters:
 *       - in: path
 *         name: link
 *         required: true
 *         schema:
 *           type: string
 *           example: "technology"
 *         description: Category link to retrieve details
 *     responses:
 *       200:
 *         description: Successfully retrieved category details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Category'
 *       404:
 *         description: Category item not found
 *       500:
 *         description: Server error
 */
router.get('/get-by-link/:link', getCategoryDetailsByLink);

export default router;
