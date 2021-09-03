import Api from '@/service/api';

import { AxiosServerResponse, SimpleResponse, ServerResponse } from '@/model/response';
import { AxiosResponse } from 'axios';
import { JupyterConfiguration, JupyterUserStatus } from '@/model/notebook';

const baseUri = '/action/notebooks';

export default class NotebooksApi extends Api {
  constructor() {
    super({ withCredentials: true });
  }

  public async getConfiguration(): Promise<ServerResponse<JupyterConfiguration>> {
    const url = baseUri;

    return this.get<ServerResponse<JupyterConfiguration>>(url)
      .then((response: AxiosResponse<ServerResponse<JupyterConfiguration>>) => {
        const { data } = response;

        return data;
      });
  }

  public async getServerStatus(): Promise<ServerResponse<JupyterUserStatus>> {
    const url = `${baseUri}/server`;

    return this.get<ServerResponse<JupyterUserStatus>>(url)
      .then((response: AxiosServerResponse<JupyterUserStatus>) => {
        const { data } = response;

        return data;
      });
  }

  public async startServer(profile: string): Promise<ServerResponse<JupyterUserStatus>> {
    const url = `${baseUri}/server?profile=${profile}`;

    return this.post<unknown, ServerResponse<JupyterUserStatus>>(url, null)
      .then((response: AxiosServerResponse<JupyterUserStatus>) => {
        const { data } = response;

        return data;
      });
  }

  public async stopServer(): Promise<SimpleResponse> {
    const url = `${baseUri}/server`;

    return this.delete<SimpleResponse>(url)
      .then((response: AxiosResponse<SimpleResponse>) => {
        const { data } = response;
        return data;
      });
  }
}
