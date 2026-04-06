// types/api.types.ts
export interface ApiResponse<T> {
  data: T;
  message: string;
  status: number;
}

export interface User {
  id: number;
  name: string;
  email: string;
}

export type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";