import { TOKEN_KEY } from './auth';

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8080/api';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface User {
  id: string;
  username: string;
  role: string;
  profilePicture: string | null;
}

export interface CreateUserRequest {
  username: string;
  password: string;
  role: string;
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

export interface SearchParams {
  make?: string;
  model?: string;
  year?: number;
  colour?: string;
  maxMileage?: number;
}

// ---------------------------------------------------------------------------
// HTTP helpers
// ---------------------------------------------------------------------------

function getToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(TOKEN_KEY);
}

function json(method: string, body: unknown): RequestInit {
  return {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  };
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

// ---------------------------------------------------------------------------
// Auth API
// ---------------------------------------------------------------------------

export async function loginApi(username: string, password: string): Promise<string> {
  const res = await fetch(`${API_BASE}/auth/login`, json('POST', { username, password }));
  if (!res.ok) throw new Error('Invalid credentials');
  const data = await res.json();
  return data.token;
}

export const userApi = {
  getMe:          () =>
    request<User>('/auth/me'),
  uploadPicture:  (profilePicture: string) =>
    request<User>('/auth/me/picture', json('PUT', { profilePicture })),
  updatePassword: (currentPassword: string, newPassword: string) =>
    request<void>('/auth/me/password', json('PUT', { currentPassword, newPassword })),
  register:       (data: CreateUserRequest) =>
    request<User>('/auth/register', json('POST', data)),
  listAll:        () =>
    request<User[]>('/auth/users'),
  update:         (id: string, data: { username: string; role: string; password?: string }) =>
    request<User>(`/auth/users/${id}`, json('PUT', data)),
  delete:         (id: string) =>
    request<void>(`/auth/users/${id}`, { method: 'DELETE' }),
};

// ---------------------------------------------------------------------------
// Vehicle API
// ---------------------------------------------------------------------------

function makeVehicleApi(base: string) {
  return {
    getAll:   ()                              => request<Vehicle[]>(base),
    getById:  (id: string)                    => request<Vehicle>(`${base}/${id}`),
    search:   (params: SearchParams)          => request<Vehicle[]>(`${base}/search?${buildSearchQuery(params)}`),
    create:   (data: VehicleRequest)          => request<Vehicle>(base, json('POST', data)),
    update:   (id: string, data: VehicleRequest) => request<Vehicle>(`${base}/${id}`, json('PUT', data)),
    delete:   (id: string)                    => request<void>(`${base}/${id}`, { method: 'DELETE' }),
  };
}

export const lorryApi = makeVehicleApi('/lorries');
export const carApi   = makeVehicleApi('/cars');
