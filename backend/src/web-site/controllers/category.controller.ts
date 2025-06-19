import { Request, Response } from 'express';
import { getAll, getByLink } from '../services/CategoryService';

export const getAllCategory = async (req: Request, res: Response) => {
  try {
    const result = await getAll();
    res.json(result);
  } catch (error) {
    console.log('My Log error: ', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getCategoryDetailsByLink = async (req: Request, res: Response) => {
  try {
    const { link } = req.params;
    if (!link) {
      return res.status(400).json({ message: 'Link parameter is required' });
    }
    const result = await getByLink(link);
    res.json(result);
  } catch (error) {
    console.log('My Log error: ', error);
    res.status(500).json({ message: 'Server error' });
  }
};
