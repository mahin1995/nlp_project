import { Request, Response } from 'express';
import { getAll } from '../services/CategoryService';

export const getAllCategory = async (req: Request, res: Response) => {
  try {
    const result = await getAll();
    res.json(result);
  } catch (error) {
    console.log('My Log error: ', error);
    res.status(500).json({ message: 'Server error' });
  }
};
