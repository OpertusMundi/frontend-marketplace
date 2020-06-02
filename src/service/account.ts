import Api from '@/service/api';

import { AxiosServerResponse, ServerResponse } from '@/model/response';
import { LoginResult, LogoutResult } from '@/model/auth';
import { Account, ProfileCommand } from '@/model/account';

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

  public async getUserData(): Promise<ServerResponse<Account>> {
    const url = '/action/account/user-data';

    return this.get<ServerResponse<Account>>(url)
      .then((response: AxiosServerResponse<Account>) => {
        const { data } = response;

        return data;
      });
  }

  public async setProfile(command: ProfileCommand): Promise<ServerResponse<Account>> {
    const url = '/action/profile';

    return this.post<ProfileCommand, ServerResponse<Account>>(url, command)
      .then((response: AxiosServerResponse<Account>) => {
        const { data } = response;

        return data;
      });
  }
}
