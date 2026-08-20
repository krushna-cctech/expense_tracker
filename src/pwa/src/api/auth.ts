import type {
  AuthResponse,
  LoginInput,
  RegisterInput,
  User,
} from '@expense-tracker/shared';
import { API_ROUTES } from '@expense-tracker/shared';
import { apiFetch } from './http';

export function register(input: RegisterInput): Promise<AuthResponse> {
  return apiFetch<AuthResponse>(API_ROUTES.auth.register, {
    method: 'POST',
    body: JSON.stringify(input),
  });
}

export function login(input: LoginInput): Promise<AuthResponse> {
  return apiFetch<AuthResponse>(API_ROUTES.auth.login, {
    method: 'POST',
    body: JSON.stringify(input),
  });
}

export function fetchMe(): Promise<User> {
  return apiFetch<User>(API_ROUTES.auth.me);
}
