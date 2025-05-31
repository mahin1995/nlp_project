import dotenv from 'dotenv';
import express from 'express';
import mongoose from 'mongoose';

import cors from 'cors';
import authRoutes from './web-site/routes/auth.route';
import categoryRoutes from './web-site/routes/category.routes';
import chatRoute from './web-site/routes/chat.routes';
import newsRoutes from './web-site/routes/news.routes';

import { setupSwagger } from './utils/swaggerService';
import { initializeModel } from './web-site/services/chatbotv2';
import { processFeeds } from './utils/rss_parser';
dotenv.config();

const app = express();
const port = process.env.PORT || 5000;
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
// processFeeds();

// Routes
app.use('/api/news', newsRoutes);
app.use('/api/chat', chatRoute);
app.use('/api/category', categoryRoutes);
app.use('/api/auth', authRoutes);
setupSwagger(app);
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

// const job = CronJob.from({
//   cronTime: '* 5 * * * *',
//   onTick: function () {
//     processFeeds();
//     console.log('Corn job run');
//   },
//   start: true,
//   timeZone: 'Asia/Dhaka',
// });
// job.start();
// processFeeds();
