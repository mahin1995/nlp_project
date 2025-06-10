import dotenv from 'dotenv';
import express from 'express';
import mongoose from 'mongoose';
import 'reflect-metadata';

import cors from 'cors';
import './admin/api/auth.controller';
import './admin/api/category-controller';
import './admin/api/news.controller';
import './admin/api/user.controller';
import authRoutes from './web-site/routes/auth.route';
import categoryRoutes from './web-site/routes/category.routes';
import chatRoute from './web-site/routes/chat.routes';
import newsRoutes from './web-site/routes/news.routes';

import { router, setupSwagger } from './common/decorator/controller.decorator';

import { globalErrorHandler } from './utils/error/error-handler';
import { initializeModel } from './web-site/services/chatbotv2';
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
mongoose.set('debug', true);
// Routes
app.use('/api/news', newsRoutes);
app.use('/api/chat', chatRoute);
app.use('/api/category', categoryRoutes);
app.use('/api/auth', authRoutes);
app.use(router);
if (process.env.NODE_ENV === 'development') {
  setupSwagger(app);
}
app.use(globalErrorHandler);
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
