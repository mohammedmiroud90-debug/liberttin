import { getToken } from './auth';

function authHeaders(): HeadersInit {
  const token = getToken();
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

async function getJson<T>(url: string): Promise<T> {
  const res = await fetch(url, { headers: authHeaders() });
  const contentType = res.headers.get('content-type') || '';
  if (!contentType.includes('application/json')) {
    throw new Error(
      res.status === 404
        ? 'API route not found. Restart the app if this persists.'
        : `Unexpected response (${res.status}). Please try again.`,
    );
  }
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || data.error || 'Request failed');
  return data as T;
}

async function patchJson<T>(url: string, body: unknown): Promise<T> {
  const res = await fetch(url, {
    method: 'PATCH',
    headers: authHeaders(),
    body: JSON.stringify(body),
  });
  const contentType = res.headers.get('content-type') || '';
  if (!contentType.includes('application/json')) {
    throw new Error(`Unexpected response (${res.status}). Please try again.`);
  }
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || data.error || 'Request failed');
  return data as T;
}

export function fetchPatientDashboard() {
  return getJson<any>('/api/dashboard/patient');
}

export function fetchDoctorDashboard() {
  return getJson<any>('/api/dashboard/doctor');
}

export function fetchAdminDashboard() {
  return getJson<any>('/api/dashboard/admin');
}

export function fetchDoctorPatients() {
  return getJson<any>('/api/dashboard/doctor/patients');
}

export function fetchAdminUsers(role?: string) {
  const q = role ? `?role=${encodeURIComponent(role)}` : '';
  return getJson<any>(`/api/admin/users${q}`);
}

export function fetchAdminDoctors(status?: string) {
  const q = status ? `?status=${encodeURIComponent(status)}` : '';
  return getJson<any>(`/api/admin/doctors${q}`);
}

export function verifyDoctor(id: string, isVerified: boolean) {
  return patchJson(`/api/admin/doctors/${id}/verify`, { isVerified });
}

export function setUserActive(id: string, isActive: boolean) {
  return patchJson(`/api/admin/users/${id}/active`, { isActive });
}
