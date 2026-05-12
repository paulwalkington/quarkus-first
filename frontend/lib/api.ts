const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8080';

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

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, init);
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
