// services/TaskService.ts
import ApiService from './ApiService';
import type { Task, CreateTaskDTO } from '../types/task.types';

class TaskService extends ApiService {
  private readonly baseEndpoint = '/task';

  async getTasksByUserId(userId: number): Promise<Task[]> {
    return this.get<Task[]>(`${this.baseEndpoint}/${userId}`);
  }

  async createTask(taskData: CreateTaskDTO): Promise<Task> {
    return this.post<Task>(this.baseEndpoint, taskData);
  }
}

export default TaskService;