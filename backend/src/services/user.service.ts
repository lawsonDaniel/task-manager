import { UserModel } from '../models/user.model';
import { User } from '../types/index';
import { AppError } from '../middleware/error.middleware';

export const UserService = {
  findById: (id: string): User => {
    const user = UserModel.findById(id);
    if (!user) throw new AppError(404, `User ${id} not found`);
    return user;
  },

  create: (data: Omit<User, 'id' | 'createdAt'>): User => {
    return UserModel.create(data);
  },
};