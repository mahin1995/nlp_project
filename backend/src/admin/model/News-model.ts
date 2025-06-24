import mongoose, { Document, Schema } from 'mongoose';
import { ICategory } from './Category-model';

export interface INews extends Document {
  _id: String | null;
  id?: String;
  title: string;
  link: string;
  content: string;
  publishedAt: Date | null;
  image: string;
  embedding?: number[];
  author?: string;
  website: string;
  category: mongoose.Types.ObjectId | ICategory;
}
export interface INewsInput {
  title: string;
  link: string;
  image: string | null;
  category?: mongoose.Types.ObjectId | ICategory;
  content: string;
  publishedAt: Date | null;
  embedding?: number[] | null | undefined;
  author?: string;
  website: string;
}
export enum news_origin {
  OUTSIDE = 'outside',
  INSIDE = 'inside',
}
const newsSchema = new Schema(
  {
    title: { type: String, required: true },
    link: { type: String, required: true, unique: true },
    image: { type: String, required: true },
    content: { type: String, required: true },
    publishedAt: { type: Date, default: null },
    embedding: { type: [Number], default: [], index: true }, // ✅ Default to an empty array
    author: { type: String },
    website: { type: String, required: true },
    category: { type: Schema.Types.ObjectId, ref: 'Category', required: true },
    isActive: { type: Boolean, default: true },
    // origin: { type: String, enum: Object.values(news_origin), required: false },
  },
  { timestamps: true }
);
const NewsModel = mongoose.model<INews>('News', newsSchema);
export default NewsModel;
