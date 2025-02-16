import News, { INews } from '../models/News';
import { AdvancedNLPService } from './AdvanceNLPService';

const nlpService = new AdvancedNLPService();

async function PrecomputeEmbeddingsFN() {
  await nlpService.initialize();

  const allNews = await News.find({});
  for (const news:INews of allNews) {
    const embedding = await nlpService.getEmbedding(
      `${news.title} ${news.content} ${news.category}`
    );
    news.embedding = embedding;
    await news.save();
  }

  console.log('Embeddings precomputed for all news articles.');
}

export { PrecomputeEmbeddingsFN };
