const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8080';

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

export const lorryApi = {
  getAll: () => request<Vehicle[]>('/lorries'),
  getById: (id: string) => request<Vehicle>(`/lorries/${id}`),
  create: (data: VehicleRequest) =>
    request<Vehicle>('/lorries', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    }),
  delete: (id: string) => request<void>(`/lorries/${id}`, { method: 'DELETE' }),
};

export const carApi = {
  getAll: () => request<Vehicle[]>('/cars'),
  getById: (id: string) => request<Vehicle>(`/cars/${id}`),
  create: (data: VehicleRequest) =>
    request<Vehicle>('/cars', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    }),
  delete: (id: string) => request<void>(`/cars/${id}`, { method: 'DELETE' }),
};
