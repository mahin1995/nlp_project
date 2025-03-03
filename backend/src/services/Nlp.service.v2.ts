// src/services/nlp.service.ts

export class NlpServiceV2 {
  public model: any;
  public initialized = false;

  // Initialize the model with error handling
  async initialize() {
    try {
      import('@xenova/transformers').then(({ pipeline }) => {
        this.model =  pipeline(
          'feature-extraction',
          'Xenova/all-mpnet-base-v2',
          {
            quantized: true, // Use quantized model for faster loading
            progress_callback: (progress: any) => {
              console.log(
                `Download progress: ${Math.round((progress.loaded / progress.total) * 100)}%`
              );
            },
          }
        );
      });

      this.initialized = true;
      console.log('NLP model initialized successfully');
    } catch (error) {
      console.error('Failed to initialize NLP model:', error);
      throw error;
    }
  }

  // Get embeddings with validation
  async getEmbedding(text: string): Promise<number[]> {
    if (!this.initialized) {
      throw new Error('NLP model not initialized. Call initialize() first.');
    }

    try {
      const result = await this.model(text, {
        pooling: 'mean',
        normalize: true,
        padding: true,
        truncation: true,
      });
      return Array.from(result.data);
    } catch (error) {
      console.error('Error generating embedding:', error);
      throw error;
    }
  }

  // Optimized cosine similarity calculation
  cosineSimilarity(vecA: number[], vecB: number[]): number {
    if (vecA.length !== vecB.length) {
      throw new Error('Vectors must have the same length');
    }

    let dotProduct = 0;
    let magnitudeA = 0;
    let magnitudeB = 0;

    for (let i = 0; i < vecA.length; i++) {
      dotProduct += vecA[i] * vecB[i];
      magnitudeA += vecA[i] ** 2;
      magnitudeB += vecB[i] ** 2;
    }

    magnitudeA = Math.sqrt(magnitudeA);
    magnitudeB = Math.sqrt(magnitudeB);

    return dotProduct / (magnitudeA * magnitudeB);
  }
}
