import { Request, Response } from 'express';
import News from '../models/News';
import {
    getHomeDataCategoryWish,
  getPageDataByCategory,
  getPaginatedNews,
} from '../services/NewsService';
import { NLPService } from '../services/nlp.service';

const nlpService = new NLPService();

export const getRecommendations = async (req: Request, res: Response) => {
  try {
    const { prompt } = req.body;

    // NLP Processing
    const keywords = nlpService.processPrompt(prompt);

    // MongoDB Text Search
    const results = await News.find({
      $text: { $search: keywords.join(' ') },
    })
      .sort({ score: { $meta: 'textScore' } })
      .limit(5);

    res.json(results);
  } catch (error) {
    console.log('My Log error: ', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getAll = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    // MongoDB Text Search
    const results = await getPaginatedNews(page, limit);

    res.json(results);
  } catch (error) {
    console.log('My Log error: ', error);
    res.status(500).json({ message: 'Server error' });
  }
};
export const getAllByCategory = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const category = req.query.category as string;
    let result = {};
    // MongoDB Text Search
    if (category) {
      const results = await getPageDataByCategory(page, limit, category);
      result = results;
    }
    return res.json(result);
  } catch (error) {
    console.log('My Log error: ', error);
    res.status(500).json({ message: 'Server error' });
  }
};
export const getHomePageData = async (req: Request, res: Response) => {
  try {
    let result=await getHomeDataCategoryWish()
    return res.json(result);
  } catch (error) {
    console.log('My Log error: ', error);
    res.status(500).json({ message: 'Server error' });
  }
};
