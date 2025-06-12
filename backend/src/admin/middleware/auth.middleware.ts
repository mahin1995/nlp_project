import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import User from '../model/Admin-user-model';

declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

export const protect = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({ message: 'Not authorized, no token' });
      return;
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || 'your-secret-key'
    ) as any;
    if (!decoded || !decoded.id) {
      res.status(401).json({ message: 'Not authorized, token invalid' });
      return;
    }
    const user = await User.findById(decoded.id).select('-password');
    if (!user) {
      res.status(401).json({ message: 'User not found' });
      return;
    }

    req.user = user;
    next(); // ✅ call only if all checks passed
  } catch (error) {
    res.status(401).json({ message: 'Not authorized, token failed' });
  }
};
