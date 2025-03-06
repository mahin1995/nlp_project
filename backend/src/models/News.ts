import mongoose, { Document, Schema } from 'mongoose';

export interface INews extends Document {
  _id: String;
  id: String;
  title: string;
  link: string;
  category: string;
  content: string;
  publishedAt: Date;
  image: string;
  embedding: number[];
  author: string;
  website: string;
}

const newsSchema = new Schema({
  title: String,
  link: String,
  image: String,
  category: String,
  content: String,
  publishedAt: Date,
  embedding: [Number],
  autor: String,
  website: String,
});

export default mongoose.model<INews>('News', newsSchema);
