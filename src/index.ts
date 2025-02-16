import dotenv from 'dotenv';
import express from 'express';
import mongoose from 'mongoose';

import newsRoutes from './routes/news.routes';
import { PrecomputeEmbeddingsFN } from './services/PrecomputeEmbeddings';

dotenv.config();

const app = express();
const port = 3000;

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
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
