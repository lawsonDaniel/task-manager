// types/task.types.ts
export type Status = 'todo' | 'in-progress' | 'done';

export interface Task {
  id: number;
  userId: number;
  title: string;
  description: string;
  status: Status;
  createdAt: Date;
}

export interface CreateTaskDTO {
  userId: string;
  title: string;
  description: string;
  status: Status;
}