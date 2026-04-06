import { User } from '../types/index';

// Example with a plain in-memory store (swap with Prisma/Mongoose etc.)
export const usersdb: User[] = [
    {
    id: '1',
    name: 'John Doe',
    email: 'test@test.comm',
    createdAt: new Date()
    }
];

export const UserModel = {
  findById: (id: string): User | undefined =>
    usersdb.find(u => u.id === id),

  create: (data: Omit<User, 'id' | 'createdAt'>): User => {
    const user: User = { ...data, id: crypto.randomUUID(), createdAt: new Date() };
    usersdb.push(user);
    return user;
  },
};