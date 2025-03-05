import * as tf from '@tensorflow/tfjs-node';
import * as fs from 'fs/promises';
import natural from 'natural';

// Define intent structure
interface Intent {
  tag: string;
  patterns: string[];
  responses: string[];
}

interface IntentData {
  intents: Intent[];
}

// Tokenizer setup
const tokenizer = new natural.WordTokenizer();
let words: string[] = [];
let model: tf.LayersModel | null = null;
let intents: IntentData;

// Function to load model and intents
export const initializeModel = async () => {
  try {
    console.log('Loading intents...');
    const data = await fs.readFile(
      '/home/mahin/Personal/Archive/node/NLP_project/backend/src/utils/newsIntents.json',
      'utf-8'
    );
    intents = JSON.parse(data);

    words = [
      ...new Set(
        intents.intents.flatMap((intent) =>
          intent.patterns.flatMap((pattern) =>
            tokenizer.tokenize(pattern.toLowerCase())
          )
        )
      ),
    ];

    console.log('Loading TensorFlow model...');
    model = await tf.loadLayersModel('file://./model/model.json');
    console.log('Model loaded successfully.');
  } catch (error) {
    console.error('Error loading model or intents:', error);
    throw error;
  }
};

// Convert text into numerical vector
const vectorize = (text: string): tf.Tensor2D => {
  const tokenized = tokenizer.tokenize(text.toLowerCase());
  return tf.tensor2d([words.map((word) => (tokenized.includes(word) ? 1 : 0))]);
};

// Predict intent
export const predictIntent = async (text: string) => {
  if (!model) {
    throw new Error('Model not loaded.');
  }

  const prediction = model.predict(vectorize(text)) as tf.Tensor;
  const intentIndex = prediction.argMax(1).dataSync()[0];

  const intent = intents.intents[intentIndex];
  const response =
    intent.responses[Math.floor(Math.random() * intent.responses.length)];

  return response;
};
