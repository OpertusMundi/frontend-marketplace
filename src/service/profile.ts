import Api from '@/service/api';

import { AxiosServerResponse, ServerResponse } from '@/model/response';
import {
  Account, AccountProfileCommand,
} from '@/model/account';

export default class ProfileApi extends Api {
  constructor() {
    super({ withCredentials: true });
  }

  /**
   * Get profile data
   */
  public async getProfile(): Promise<ServerResponse<Account>> {
    const url = '/action/profile';

    return this.get<ServerResponse<Account>>(url)
      .then((response: AxiosServerResponse<Account>) => {
        const { data } = response;

        return data;
      });
  }

  /**
   * Update profile data
   *
   * @param command Profile update command
   */
  public async updateProfile(command: AccountProfileCommand): Promise<ServerResponse<Account>> {
    const url = '/action/profile';

    return this.post<AccountProfileCommand, ServerResponse<Account>>(url, command)
      .then((response: AxiosServerResponse<Account>) => {
        const { data } = response;

        return data;
      });
  }
}
