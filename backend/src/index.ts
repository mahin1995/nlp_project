import dotenv from 'dotenv';
import express from 'express';
import mongoose from 'mongoose';

import cors from 'cors';
import chatRoute from './routes/chat.routes';
import newsRoutes from './routes/news.routes';

import { initializeModel } from './services/chatbotv2';
dotenv.config();

const app = express();
const port = 3000;
const corsOptions = {
  origin: '*',
  optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
};
app.use(cors(corsOptions));
// Middleware
app.use(express.json());

// MongoDB Connection
mongoose
  .connect(process.env.MONGODB_URI!)
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((err) => console.error('MongoDB connection error:', err));
// PrecomputeEmbeddingsFN();
// Routes

app.use('/api/news', newsRoutes);
app.use('/api/chat', chatRoute);



initializeModel()
  .then(() => {
    app.listen(port, () => {
        console.log(`Server running on http://localhost:${port}`);
      });
    console.log('Model and intents initialized.');
  })
  .catch((err: any) => {
    console.error('Failed to initialize:', err);
    process.exit(1); // Stop server if initialization fails
  });
