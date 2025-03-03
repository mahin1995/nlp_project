import mongoose, { Document, Schema } from 'mongoose';

export interface INews extends Document {
  title: string;
  link: string;
  category: string;
  content: string;
  publishedAt: Date;
  embedding:number[];
}

const newsSchema = new Schema({
  title: String,
  link: String,
  category: String,
  content: String,
  publishedAt: Date,
  embedding: [Number],
});

export default mongoose.model<INews>('News', newsSchema);
