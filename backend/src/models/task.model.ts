import { Task } from '../types/index';
import { usersdb } from './user.model';
// Example with a plain in-memory store (swap with Prisma/Mongoose etc.)
const task: Task[] = [];

export const TaskModel = {
  create: (data: Omit<Task, 'id' | 'createdAt'>): Task => {
    //check if the task has a valid userId
    const user = usersdb.find(u => u.id === data.userId);
    if (!user) throw new Error(`User ${data.userId} not found`);
    const newTask: Task = { ...data, id: crypto.randomUUID(), createdAt: new Date() };
    task.push(newTask);
    return newTask;
  },
  getByUserId: (id: string): Task| undefined =>
     task.find(t => t.userId === id)
};