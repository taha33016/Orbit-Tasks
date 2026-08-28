import type { UserProfile } from '../types/domain';
import { api } from './api';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterProfile {
  fullName: string;
  email: string;
  phone: string;
  password: string;
}

/**
 * Authentication contract for the future production backend.
 * The server owns credentials and sessions; the browser only receives
 * authenticated user data. No password or access token is persisted here.
 */
export const authApi = {
  me: () => api.get<UserProfile>('/auth/me'),
  login: (credentials: LoginCredentials) => api.post<UserProfile>('/auth/login', credentials),
  register: (profile: RegisterProfile) => api.post<UserProfile>('/auth/register', profile),
  logout: () => api.post<void>('/auth/logout', {}),
};
