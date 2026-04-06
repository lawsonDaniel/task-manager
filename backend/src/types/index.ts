export interface User {
  id: string;
  name: string;
  email: string;
  createdAt: Date;
}

export interface Task {
    id: string;
  userId: string;
  title: string;
  description: string;
  status: 'todo' | 'in-progress' | 'done';
  createdAt: Date;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
}

