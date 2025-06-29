import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import mongoose, { Document, Model, Schema } from 'mongoose';

// Interface for User Document
export interface IAdminUser extends Document {
  username: string;
  email: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
  createdBy?: mongoose.Types.ObjectId; // Optional field for created by user
  updatedBy?: mongoose.Types.ObjectId; // Optional field for updated by user
  comparePassword(candidatePassword: string): Promise<boolean>;
  generateAuthToken(): string;
  isActive?: boolean; // Optional field to indicate if the user is active
}

// Interface for User Model
interface IAdminUserModel extends Model<IAdminUser> {
  // You can add static methods here if needed
}

// User Schema
const AdminUserSchema = new Schema<IAdminUser, IAdminUserModel>(
  {
    username: {
      type: String,
      required: [true, 'Username is required'],
      unique: true,
      trim: true,
      minlength: [3, 'Username must be at least 3 characters long'],
      maxlength: [30, 'Username cannot exceed 30 characters'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      trim: true,
      lowercase: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        'Please fill a valid email address',
      ],
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [6, 'Password must be at least 6 characters long'],
      select: false, // Don't return password in queries by default
    },
    createdBy: {
      type: mongoose.Types.ObjectId,
      ref: 'Admin-user',
      default: null, // Optional field for created by user
    },
    updatedBy: {
      type: mongoose.Types.ObjectId,
      ref: 'Admin-user',
      default: null, // Optional field for updated by user
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Hash password before saving
AdminUserSchema.pre<IAdminUser>('save', async function (next) {
  if (!this.isModified('password')) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error: any) {
    next(error);
  }
});

// Method to compare passwords
AdminUserSchema.methods.comparePassword = async function (
  candidatePassword: string
): Promise<boolean> {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Method to generate JWT token
AdminUserSchema.methods.generateAuthToken = function (): string {
  const payload = {
    id: this._id,
    username: this.username,
  };

  const secret = process.env.JWT_SECRET || 'your-secret-key';
  const options: jwt.SignOptions = {
    expiresIn: 30000,
  };

  return jwt.sign(payload, secret, options);
};

// Create and export the model
const AdminUser = mongoose.model<IAdminUser, IAdminUserModel>(
  'Admin-user',
  AdminUserSchema
);
export default AdminUser;
