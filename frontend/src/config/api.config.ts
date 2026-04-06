// config/api.config.ts
const API_CONFIG = {
  baseURL: import.meta.env.VITE_API_BASE_URL ?? "http://localhost:3000/api",
  timeout: 5000,
  version: "v1",
} as const;

export default API_CONFIG;