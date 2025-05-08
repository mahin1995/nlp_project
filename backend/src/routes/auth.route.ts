import express from 'express';
import { body } from 'express-validator';
import {
  registerUser,
  loginUser,
  getMe
} from '../controllers/auth.controller';
import { protect } from '../middleware/auth.middleware';

const router = express.Router();

router.post(
  '/register',
  [
    body('username').not().isEmpty().withMessage('Username is required'),
    body('email').isEmail().withMessage('Please include a valid email'),
    body('password')
      .isLength({ min: 6 })
      .withMessage('Password must be at least 6 characters long')
  ],
  registerUser
);

router.post(
  '/login',
  [
    body('email').isEmail().withMessage('Please include a valid email'),
    body('password').not().isEmpty().withMessage('Password is required')
  ],
  loginUser
);

router.get('/me', protect, getMe);

export default router;