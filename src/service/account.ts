import Api from '@/service/api';

import { AxiosServerResponse, ServerResponse } from '@/model/response';
import { LoginResult, LogoutResult } from '@/model/auth';
import {
  Account, AccountCommandDto, ActivationTokenCommand, PasswordChangeCommand,
} from '@/model/account';

export default class AccountApi extends Api {
  constructor() {
    super({ withCredentials: true });
  }

  public async login(username: string, password: string): Promise<ServerResponse<LoginResult>> {
    const url = '/login';

    const form = new FormData();
    form.append('username', username);
    form.append('password', password);

    return this.submit<ServerResponse<LoginResult>>(url, form)
      .then((response: AxiosServerResponse<LoginResult>) => {
        const { data } = response;

        return data;
      });
  }

  public async logout(): Promise<ServerResponse<LogoutResult>> {
    const url = '/logout';

    const form = new FormData();

    return this.submit(url, form)
      .then((response: AxiosServerResponse<LogoutResult>) => {
        const { data } = response;

        return data;
      });
  }

  /**
   * Creates a new account and sends an email for verifying the user email address
   *
   * @param command - Account creation command
   */
  public async register(command: AccountCommandDto): Promise<ServerResponse<Account>> {
    const url = '/action/account/register';

    return this.post<AccountCommandDto, ServerResponse<Account>>(url, command)
      .then((response: AxiosServerResponse<Account>) => {
        const { data } = response;

        return data;
      });
  }

  /**
   * Requests a new token for verifying an email address. The token
   * is sent to the email address in the request.
   *
   * @param command - Activation token request
   */
  public async tokenRequest(command: ActivationTokenCommand): Promise<ServerResponse<void>> {
    const url = '/action/account/token/request';

    return this.post<ActivationTokenCommand, ServerResponse<void>>(url, command)
      .then((response: AxiosServerResponse<void>) => {
        const { data } = response;

        return data;
      });
  }

  /**
   * Validates an activation token
   *
   * @param token - Token to validate
   */
  public async tokenValidate(token: string): Promise<ServerResponse<void>> {
    const url = `/action/account/token/verify/${token}`;

    return this.post<ActivationTokenCommand, ServerResponse<void>>(url, null)
      .then((response: AxiosServerResponse<void>) => {
        const { data } = response;

        return data;
      });
  }

  /**
   * Change password for authenticated user
   *
   * @param currentPassword
   * @param newPassword
   * @param verifyNewPassword
   * @returns
   */
  public async changePassword(currentPassword: string, newPassword: string, verifyNewPassword: string): Promise<ServerResponse<void>> {
    const url = '/action/account/password/change';

    return this.post<PasswordChangeCommand, ServerResponse<void>>(url, {
      currentPassword,
      newPassword,
      verifyNewPassword,
    })
      .then((response: AxiosServerResponse<void>) => {
        const { data } = response;

        return data;
      });
  }
}
