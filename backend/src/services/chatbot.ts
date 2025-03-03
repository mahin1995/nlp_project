import * as use from '@tensorflow-models/universal-sentence-encoder';
import * as tf from '@tensorflow/tfjs';
import { intents } from '../utils/intents';
import { responses } from '../utils/responses';

// Define the model type
let model: use.UniversalSentenceEncoder;

// Load the Universal Sentence Encoder model
use.load().then((loadedModel) => {
  model = loadedModel;
  console.log('Model loaded');
  //   startChatbot();
});

async function recognizeIntent(userInput: string): Promise<string | null> {
  const userInputEmb = (await model.embed([
    userInput,
  ])) as unknown as tf.Tensor2D;
  let maxScore = -1;
  let recognizedIntent: string | null = null;

  for (const [intent, examples] of Object.entries(intents)) {
    const examplesEmb = (await model.embed(examples)) as unknown as tf.Tensor2D;

    // Explicit type assertion for tf.matMul to ensure compatibility
    const scores = (await tf
      .matMul(userInputEmb, examplesEmb, false, true)
      .data()) as Float32Array;
    const maxExampleScore = Math.max(...scores);

    if (maxExampleScore > maxScore) {
      maxScore = maxExampleScore;
      recognizedIntent = intent;
    }
  }
  return recognizedIntent;
}

async function generateResponse(userInput: string): Promise<string> {
  const intent = await recognizeIntent(userInput);
  return intent && responses[intent]
    ? responses[intent]
    : "I'm sorry, I don't understand that. Can you please rephrase?";
}

async function modelLoad(): Promise<void> {
  try {
    model = await use.load();
    console.log('Universal Sentence Encoder Model loaded successfully');
  } catch (error) {
    console.error('Error loading model:', error);
    process.exit(1); // Exit if model fails to load
  }
}

export { generateResponse, modelLoad };
