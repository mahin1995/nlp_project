import News from '../models/News';
import { NlpServiceV2 } from './Nlp.service.v2';

const nlpService = new NlpServiceV2();

async function PrecomputeEmbeddingsFN() {
  await nlpService.initialize();

  const allNews = await News.find({});
  for (const news of allNews) {
    const embedding = await nlpService.getEmbedding(
      `${news?.title?.toLowerCase()} ${news?.content?.toLowerCase()} ${news?.category?.toLowerCase()}`
    );
    news.embedding = embedding;
    await news.save();
  }

  console.log('Embeddings precomputed for all news articles.');
}

export { PrecomputeEmbeddingsFN };
