import { Request, Response } from 'express';

import { predictIntent } from '../services/chatbotv2';

export const getChatReplyV2 = async (req: Request, res: Response) => {
  try {
    const { prompt } = req.body;

    // NLP Processing
    const result = await predictIntent(prompt);

    // MongoDB Text Search

    res.json({ result });
  } catch (error) {
    console.log('My Log error: ', error);
    res.status(500).json({ message: 'Server error' });
  }
};
