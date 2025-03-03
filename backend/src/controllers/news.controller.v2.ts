import { Request, Response } from 'express';
import News from '../models/News';
import { NlpServiceV2 } from '../services/Nlp.service.v2';

const nlpServiceV2 = new NlpServiceV2();
nlpServiceV2.initialize().catch((error) => {
  console.error('Failed to initialize NLP service:', error);
  process.exit(1);
});
export const getRecommendationsV2 = async (req: Request, res: Response) => {
  try {
    if (!nlpServiceV2.initialized) {
      return res.status(503).json({ message: 'Service unavailable' });
    }
    const { prompt } = req.body;

    // Initialize NLP service (if not already initialized)
    if (!nlpServiceV2.model) {
      await nlpServiceV2.initialize();
    }

    // Get embedding for the user's prompt
    const promptEmbedding = await nlpServiceV2.getEmbedding(
      prompt.toLowerCase()
    );

    // Fetch all news articles with precomputed embeddings
    const allNews = await News.find({ embedding: { $exists: true } });

    // Calculate similarity scores for each news article
    const recommendations = allNews.map((news) => {
      const similarity = nlpServiceV2.cosineSimilarity(
        promptEmbedding,
        news.embedding
      );
      news.embedding = [];
      return { ...news.toObject(), similarity };
    });

    // Sort by similarity and return top 5 results
    const sortedRecommendations = recommendations
      .sort((a, b) => b.similarity - a.similarity)
      .slice(0, 5);

    res.json(sortedRecommendations);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};
