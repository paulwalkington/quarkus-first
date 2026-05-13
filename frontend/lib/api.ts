import { TOKEN_KEY } from './auth';

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8080/api';

export interface SearchParams {
  make?: string;
  model?: string;
  year?: number;
  colour?: string;
  maxMileage?: number;
}

export interface Vehicle {
  id: string;
  make: string;
  model: string;
  year: number;
  colour: string;
  mileage: number;
}

export interface VehicleRequest {
  make: string;
  model: string;
  year: number;
  colour: string;
  mileage: number;
}

function getToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(TOKEN_KEY);
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const token = getToken();
  const headers: Record<string, string> = {
    ...(init?.headers as Record<string, string>),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
  const res = await fetch(`${API_BASE}${path}`, { ...init, headers });
  if (res.status === 401) {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(TOKEN_KEY);
      window.location.href = '/login';
    }
    throw new Error('Unauthorized');
  }
  if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
  if (res.status === 204) return undefined as T;
  return res.json();
}

function buildSearchQuery(params: SearchParams): string {
  const q = new URLSearchParams();
  if (params.make) q.set('make', params.make);
  if (params.model) q.set('model', params.model);
  if (params.year) q.set('year', String(params.year));
  if (params.colour) q.set('colour', params.colour);
  if (params.maxMileage) q.set('maxMileage', String(params.maxMileage));
  return q.toString();
}

export async function loginApi(username: string, password: string): Promise<string> {
  const res = await fetch(`${API_BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  });
  if (!res.ok) throw new Error('Invalid credentials');
  const data = await res.json();
  return data.token;
}

export const lorryApi = {
  getAll: () => request<Vehicle[]>('/lorries'),
  getById: (id: string) => request<Vehicle>(`/lorries/${id}`),
  search: (params: SearchParams) => request<Vehicle[]>(`/lorries/search?${buildSearchQuery(params)}`),
  create: (data: VehicleRequest) =>
    request<Vehicle>('/lorries', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    }),
  update: (id: string, data: VehicleRequest) =>
    request<Vehicle>(`/lorries/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    }),
  delete: (id: string) => request<void>(`/lorries/${id}`, { method: 'DELETE' }),
};

export const carApi = {
  getAll: () => request<Vehicle[]>('/cars'),
  getById: (id: string) => request<Vehicle>(`/cars/${id}`),
  search: (params: SearchParams) => request<Vehicle[]>(`/cars/search?${buildSearchQuery(params)}`),
  create: (data: VehicleRequest) =>
    request<Vehicle>('/cars', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    }),
  update: (id: string, data: VehicleRequest) =>
    request<Vehicle>(`/cars/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    }),
  delete: (id: string) => request<void>(`/cars/${id}`, { method: 'DELETE' }),
};
