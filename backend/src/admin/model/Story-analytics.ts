export interface IStoryAnalytics extends Document {
  _id: string;
  storyId: string;
  count: number;
  createdAt: Date;
  updatedAt: Date;
}

import mongoose, { Document, Schema } from 'mongoose';
export interface IStoryAnalyticsInput {
  storyId: string;
  count: number;
}
const storyAnalyticsSchema = new Schema(
  {
    storyId: { type: String, required: true },
    count: { type: Number, required: true, default: 0 },
  },
  { timestamps: true }
);
const StoryAnalyticsModel = mongoose.model<IStoryAnalytics & Document>(
  'StoryAnalytics',
  storyAnalyticsSchema
);
export default StoryAnalyticsModel;

import AbstractRepository from '../../common/abstract/repository/AbstractRepository';
import { Repository } from '../../common/decorator/repository.decorator';

@Repository()
export class StoryAnalyticsRepository extends AbstractRepository<IStoryAnalytics> {
  protected model = StoryAnalyticsModel;

  getModel() {
    return this.model;
  }

  validateInput(input: never) {
    throw new Error('Method not implemented.');
  }
}
