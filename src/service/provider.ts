import Api from '@/service/api';

import { AxiosServerResponse, ServerResponse } from '@/model/response';
import { ProviderProfessionalCommand, Profile, ProviderProfileCommand } from '@/model/account';

export default class ProviderApi extends Api {
  constructor() {
    super({ withCredentials: true });
  }

  /**
   * Update optional properties of a provider's profile.
   *
   * @param command
   */
  public async updateProfile(command: ProviderProfileCommand): Promise<ServerResponse<Profile>> {
    const url = '/action/provider/profile';

    return this.post<ProviderProfileCommand, ServerResponse<Profile>>(url, command)
      .then((response: AxiosServerResponse<Profile>) => {
        const { data } = response;

        return data;
      });
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

  /**
   * Check if company name is available
   *
   * @param name
   * @returns
   */
  public async isNameAvailable(name: string): Promise<boolean> {
    const url = `/action/provider/name?name=${name}`;

    return this.get<ServerResponse<boolean>>(url)
      .then((response: AxiosServerResponse<boolean>) => {
        const { data } = response;

        return data.result;
      });
  }
}
