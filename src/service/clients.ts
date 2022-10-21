import Api from '@/service/api';
import { showApiErrorModal } from '@/helper/api-errors';
import { SimpleResponse, ServerResponse, PageResult } from '@/model/response';
import { AxiosResponse } from 'axios';
import { Client } from '@/model/client';

export default class ClientsApi extends Api {
  constructor() {
    super({ withCredentials: true });
  }

  baseURL = '/action/account/clients';

  public async getClients(): Promise<ServerResponse<PageResult<Client>>> {
    const url = this.baseURL;

    return this.get<ServerResponse<PageResult<Client>>>(url)
      .then((response: AxiosResponse<ServerResponse<PageResult<Client>>>) => {
        const { data } = response;
        if (data.success === false) showApiErrorModal(data.messages);

        return data;
      });
  }

  public async createClient(alias: string): Promise<ServerResponse<Client>> {
    const url = this.baseURL;

    return this.post<{ alias: string }, ServerResponse<Client>>(url, { alias })
      .then((response: AxiosResponse<ServerResponse<Client>>) => {
        const { data } = response;
        if (data.success === false) showApiErrorModal(data.messages);

        return data;
      });
  }

  public async revokeClient(key: string): Promise<SimpleResponse> {
    const url = `${this.baseURL}/${key}`;

    return this.delete<SimpleResponse>(url)
      .then((response: AxiosResponse<SimpleResponse>) => {
        const { data } = response;
        if (data.success === false) showApiErrorModal(data.messages);

        return data;
      });
  }
}
