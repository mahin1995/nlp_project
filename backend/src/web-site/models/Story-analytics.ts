import { Document } from 'mongoose';
import StoryAnalyticsModel from '../../admin/model/Story-analytics';
export interface IStoryAnalyticsInput {
  storyId: string;
  count: number;
}

export interface IStoryAnalytics extends Document {
  _id: string;
  storyId: string;
  count: number;
  createdAt: Date;
  updatedAt: Date;
}
export default StoryAnalyticsModel;
