import Api from '@/service/api';

import { AxiosServerResponse, ServerResponse } from '@/model/response';
import { ProviderProfessionalCommand, Profile } from '@/model/account';

export default class ProviderApi extends Api {
  constructor() {
    super({ withCredentials: true });
  }

  /**
   * Update provider data.
   *
   * If a draft request already exists, it is updated; Otherwise a new request is created. A
   * draft request is locked once the submitRegistration method is called.
   *
   * @param command Provider update command
   */
  public async updateRegistration(command: ProviderProfessionalCommand): Promise<ServerResponse<Profile>> {
    const url = '/action/provider/registration';

    return this.post<ProviderProfessionalCommand, ServerResponse<Profile>>(url, command)
      .then((response: AxiosServerResponse<Profile>) => {
        const { data } = response;

        return data;
      });
  }

  /**
   * Update and submit for review provider data.
   *
   * If a draft request already exists, it is updated; Otherwise a new request is created. The
   * request is locked and submitted for review by the HelpDesk users.
   *
   * @param command Provider update command
   */
  public async submitRegistration(command: ProviderProfessionalCommand): Promise<ServerResponse<Profile>> {
    const url = '/action/provider/registration';

    return this.put<ProviderProfessionalCommand, ServerResponse<Profile>>(url, command)
      .then((response: AxiosServerResponse<Profile>) => {
        const { data } = response;

        return data;
      });
  }

  /**
   * Cancel any pending registration request
   */
  public async cancelRegistration(): Promise<ServerResponse<Profile>> {
    const url = '/action/provider/registration';

    return this.delete<ServerResponse<Profile>>(url)
      .then((response: AxiosServerResponse<Profile>) => {
        const { data } = response;

        return data;
      });
  }
}
