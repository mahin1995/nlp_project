import { Request, Response } from 'express';
import News from '../models/News';
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
