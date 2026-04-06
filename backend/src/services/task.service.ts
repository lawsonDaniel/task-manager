import { TaskModel } from '../models/task.model';
import { Task} from '../types/index';
import { AppError } from '../middleware/error.middleware';

export const TaskService = {
  findById: (id: string): Task => {
    const task = TaskModel.getByUserId(id);
    if (!task) throw new AppError(404, `Task ${id} not found`);
    return task;
  },

  create: (data: Omit<Task, 'id' | 'createdAt'>): Task => {
    return TaskModel.create(data);
  },

};
