export interface LoginSuccessResult {
  csrfHeader: string;
  csrfToken: string;
}

export interface LogoutSuccessResult {
  csrfHeader: string;
  csrfToken: string;
}
