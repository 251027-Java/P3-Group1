/**
 * Simple HTTP client wrapper for API requests
 */

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api/react/api';

export interface HttpOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  headers?: Record<string, string>;
  body?: unknown;
}

export class HttpError extends Error {
  constructor(
    public status: number,
    public statusText: string,
    public data?: unknown
  ) {
    super(`HTTP ${status}: ${statusText}`);
    this.name = 'HttpError';
  }
}

export async function http<T>(endpoint: string, options: HttpOptions = {}): Promise<T> {
  const { method = 'GET', headers = {}, body } = options;

  const config: RequestInit = {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
  };

  if (body) {
    config.body = JSON.stringify(body);
  }

  const url = `${BASE_URL}${endpoint}`;
  const response = await fetch(url, config);

  if (!response.ok) {
    let errorData;
    try {
      errorData = await response.json();
    } catch {
      errorData = await response.text();
    }
    throw new HttpError(response.status, response.statusText, errorData);
  }

  // Handle empty responses (e.g., 204 No Content)
  if (response.status === 204) {
    return {} as T;
  }

  return response.json();
}

export default http;
