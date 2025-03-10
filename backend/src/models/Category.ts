import mongoose, { Document, Schema } from 'mongoose';

export interface ICategory extends Document {
  name: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}
export interface ICategoryOut  {
    _id:string
    name: string;
    description?: string;
    createdAt: Date;
    updatedAt: Date;
  }

const categorySchema = new Schema<ICategory>(
  {
    name: { type: String, required: true, unique: true, index: true },
    description: { type: String },
  },
  { timestamps: true } // ✅ Adds createdAt & updatedAt
);

export default mongoose.model<ICategory>('Category', categorySchema);
