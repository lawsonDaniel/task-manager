import { Request, Response, NextFunction } from 'express';
import { TaskService } from '../services/task.service';
import { ApiResponse, Task,User } from '../types/index';

export const TaskController = {
  getTaskByUserId: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        console.log('Getting tasks for userId:', req.params);
      const task = TaskService.findById(req.params.userId as string);
      const response: ApiResponse<Task> = { success: true, data: task };
      res.json(response);
    } catch (err) {
      next(err);
    }
  },

  createTask: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const task = TaskService.create(req.body);
      const response: ApiResponse<Task> = { success: true, data: task };
      res.status(201).json(response);
    } catch (err) {
      next(err);
    }
  },
};