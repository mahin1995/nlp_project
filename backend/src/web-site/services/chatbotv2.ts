import * as tf from '@tensorflow/tfjs-node';
import * as fs from 'fs/promises';
import natural from 'natural';
import { getPageDataByCategory, getPaginatedNews } from './NewsService';
import path from 'path';

// Define intent structure
interface Intent {
  tag: string;
  patterns: string[];
  responses: string[];
  type: string;
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
        const filePath = path.join(__dirname, '../../utils/newsIntents.json');
    
    const data = await fs.readFile(
     filePath,
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

  const inputTensor = vectorize(text);
  const prediction = model.predict(inputTensor) as tf.Tensor;
  const scores = await prediction.data(); // Get confidence scores
  const intentIndex = prediction.argMax(1).dataSync()[0];

  const intent = intents.intents[intentIndex];
  //   console.log('My Log intent: ', scores);
  //   console.log('My Log intent: ', intent);
  let response = null;
  if (intent.type == 'CATEGORY') {
    const newsList = await getPageDataByCategory(1, 10, intent.tag);
    response = { messageType: 'NEWS', news: newsList };
  }
  if (intent.type == 'NEWS') {
    const newsList = await getPaginatedNews(1, 10);
    response = { messageType: 'NEWS', news: newsList };
  }
   else {
    if (intent?.responses) {
      let message =
        intent?.responses[Math.floor(Math.random() * intent.responses.length)];
      if (message) {
        response = { messageType: 'PROMPT', message };
      }
    } else {
      response = {
        messageType: 'PROMPT',
        message: 'Somthing Wrong please try again!!',
      };
    }
  }
  return response;
};
