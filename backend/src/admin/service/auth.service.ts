import { Service } from 'typedi';
import AdminUser, { IAdminUser } from '../model/Admin-user-model';
import { AppError } from '../../utils/app-errors';
@Service()
export class AuthService {
  async registerUser(username: string, email: string, password: string) {
    // Check if user exists
    const existingUser = await AdminUser.findOne({ email });
    if (existingUser) {
      throw   AppError.badRequest('User already exists');
    }

    // Create new user
    const user: IAdminUser = new AdminUser({ username, email, password });
    await user.save();

    const token = user.generateAuthToken();

    return {
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
      },
    };
  }

  async loginUser({
    email,
    username,
    password,
  }: {
    email?: string;
    username?: string;
    password: string;
  }) {
    if (!username && !email) {
      throw  AppError.badRequest('Username or email is required');
    }

    let user;

    if (email) {
      user = await AdminUser.findOne({ email }).select('+password');
    }

    if (!user && username) {
      user = await AdminUser.findOne({ username }).select('+password');
    }

    if (!user) {
      throw   AppError.badRequest('Invalid credentials');
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      throw   AppError.badRequest('Invalid credentials');
    }

    const token = user.generateAuthToken();

    return {
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
      },
    };
  }

  async getCurrentUser(userId: string) {
    const user = await AdminUser.findById(userId).select('-password');
    if (!user) {
      throw  AppError.badRequest('User not found');
    }
    return user;
  }
}
