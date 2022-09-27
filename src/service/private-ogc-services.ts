import Api from '@/service/api';
import { showApiErrorModal } from '@/helper/api-errors';
import { AxiosServerResponse, ServerResponse } from '@/model/response';
import { PrivateOGCService, PrivateOGCServiceCommand } from '@/model/private-ogc-services';

const baseUri = '/action/user/services';

export default class PrivateOGCServicesApi extends Api {
  constructor() {
    super({ withCredentials: true });
  }

  public async create(command: PrivateOGCServiceCommand): Promise<ServerResponse<PrivateOGCService>> {
    const url = baseUri;

    return this.post<PrivateOGCServiceCommand, ServerResponse<PrivateOGCService>>(url, command)
      .then((response: AxiosServerResponse<PrivateOGCService>) => {
        const { data } = response;
        if (data.success === false) showApiErrorModal(data.messages);

        return data;
      });
  }
}
