// services/ApiService.ts
import type { HttpMethod } from "../types/api.types";
import API_CONFIG  from "../config/api.config";

class ApiService {
  private baseURL: string;
  private headers: HeadersInit;

  constructor() {
    this.baseURL = `${API_CONFIG.baseURL}/${API_CONFIG.version}`;
    this.headers = {
      "Content-Type": "application/json",
    };
  }

  setAuthToken(token: string): void {
    this.headers = {
      ...this.headers,
      Authorization: `Bearer ${token}`,
    };
  }

  private async request<T>(
    method: HttpMethod,
    endpoint: string,
    body?: unknown
  ): Promise<T> {
    const config: RequestInit = {
      method,
      headers: this.headers,
      ...(body ? { body: JSON.stringify(body) } : {}),
    };

    const response = await fetch(`${this.baseURL}${endpoint}`, config);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json() as Promise<T>;
  }

  protected get<T>(endpoint: string): Promise<T> {
    return this.request<T>("GET", endpoint);
  }

  protected post<T>(endpoint: string, data: unknown): Promise<T> {
    return this.request<T>("POST", endpoint, data);
  }

  protected put<T>(endpoint: string, data: unknown): Promise<T> {
    return this.request<T>("PUT", endpoint, data);
  }

  protected patch<T>(endpoint: string, data: unknown): Promise<T> {
    return this.request<T>("PATCH", endpoint, data);
  }

  protected delete<T>(endpoint: string): Promise<T> {
    return this.request<T>("DELETE", endpoint);
  }
}

export default ApiService;