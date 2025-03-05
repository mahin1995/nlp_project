import * as tf from '@tensorflow/tfjs-node';
import * as fs from 'fs/promises';
import natural from 'natural';

// Define types for intent structure
interface Intent {
  tag: string;
  patterns: string[];
  responses: string[];
}

interface IntentData {
  intents: Intent[];
}

// Tokenizer
const tokenizer = new natural.WordTokenizer();

// Function to load and process training data
const loadData = async (): Promise<{
  xTrain: tf.Tensor2D;
  yTrain: tf.Tensor2D;
  labels: string[];
  words: string[];
}> => {
  try {
    // Read and parse intents JSON file
    const data: string = await fs.readFile(
      '/home/mahin/Personal/Archive/node/NLP_project/backend/src/utils/newsIntents.json',
      'utf-8'
    );
    // console.log('My Log data: ',data)
    const intents: IntentData = JSON.parse(data);

    let labels: string[] = [];
    let trainingData: string[][] = [];
    let outputLabels: number[] = [];

    intents.intents.forEach((intent, index) => {
      intent.patterns.forEach((pattern) => {
        const tokenized = tokenizer.tokenize(pattern.toLowerCase());
        trainingData.push(tokenized);
        outputLabels.push(index);
      });
      labels.push(intent.tag);
    });

    // Convert words to a unique set (Bag of Words approach)
    const words: string[] = [...new Set(trainingData.flat())];

    // Convert text into numerical vectors
    const vectorize = (tokenized: string[]): number[] => {
      return words.map((word) => (tokenized.includes(word) ? 1 : 0));
    };

    // Convert to Tensors
    const xTrain: tf.Tensor2D = tf.tensor2d(trainingData.map(vectorize));
    const yTrain: tf.Tensor2D = tf.oneHot(
      tf.tensor1d(outputLabels, 'int32'),
      labels.length
    ) as tf.Tensor2D;

    return { xTrain, yTrain, labels, words };
  } catch (error) {
    console.error('Error loading data:', error);
    throw error;
  }
};

// Train model function
const trainModel = async () => {
  try {
    console.log('Loading data...');
    const { xTrain, yTrain, labels, words } = await loadData();

    console.log('Building model...');
    const model = tf.sequential();

    // Input layer
    model.add(
      tf.layers.dense({
        inputShape: [words.length],
        units: 16,
        activation: 'relu',
      })
    );
    model.add(tf.layers.dense({ units: 16, activation: 'relu' }));

    // Output layer
    model.add(tf.layers.dense({ units: labels.length, activation: 'softmax' }));

    // Compile model
    model.compile({
      loss: 'categoricalCrossentropy',
      optimizer: tf.train.adam(),
      metrics: ['accuracy'],
    });

    // Train the model
    console.log('Training model...');
    await model.fit(xTrain, yTrain, { epochs: 100 });

    console.log('Training complete. Saving model...');
    await model.save('file://./model');
    console.log('Model saved successfully.');
  } catch (error) {
    console.error('Error training model:', error);
  }
};

// Run training
trainModel();
