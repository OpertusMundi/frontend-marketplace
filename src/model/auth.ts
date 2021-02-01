export interface AuthResult {
  csrfHeader: string;
  csrfToken: string;
}

export type LoginResult = AuthResult

export type LogoutResult = AuthResult
