export type RoleType = 'ROLE_ADMIN' | 'ROLE_MANAGER' | 'ROLE_USER';

export interface User {
  id: number;
  username: string;
  email: string;
  fullName: string;
  avatarUrl?: string;
  roles: string[];
}

export interface LoginRequest {
  username: string;
  password?: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  fullName: string;
  password?: string;
  roles?: string[];
}

export interface JwtResponse {
  token: string;
  type: string;
  id: number;
  username: string;
  email: string;
  fullName: string;
  avatarUrl?: string;
  roles: string[];
}
