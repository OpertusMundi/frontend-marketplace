import Api from '@/service/api';
import { showApiErrorModal } from '@/helper/api-errors';
import { AxiosServerResponse, ServerResponse, PageResult } from '@/model/response';
import {
  EnumServiceType,
  EnumStatus,
  PrivateOGCService,
  PrivateOGCServiceCommand,
} from '@/model/private-ogc-services';

const baseUri = '/action/user/services';

enum EnumOrderBy {
  CREATED_ON = 'CREATED_ON',
  STATUS = 'STATUS',
  TITLE = 'TITLE',
  UPDATED_ON = 'UPDATED_ON',
  VERSION = 'VERSION',
}

export default class PrivateOGCServicesApi extends Api {
  constructor() {
    super({ withCredentials: true });
  }

  public find(
    page: number,
    size: number,
    status?: EnumStatus,
    serviceType?: EnumServiceType,
    orderBy?: EnumOrderBy,
    order?: 'ASC' | 'DESC',
  ): Promise<ServerResponse<PageResult<PrivateOGCService>>> {
    const url = `${baseUri}?status=${status || ''}&serviceType=${serviceType || ''}&page=${page}&size=${size}&orderBy=${orderBy || ''}&order=${order || ''}`;

    return this.get<ServerResponse<PageResult<PrivateOGCService>>>(url)
      .then((response: AxiosServerResponse<PageResult<PrivateOGCService>>) => {
        const { data } = response;
        if (data.success === false) showApiErrorModal(data.messages);

        return data;
      });
  }

  public findOne(key: string): Promise<ServerResponse<PrivateOGCService>> {
    const url = `${baseUri}/${key}`;

    return this.get<ServerResponse<PrivateOGCService>>(url)
      .then((response: AxiosServerResponse<PrivateOGCService>) => {
        const { data } = response;

        return data;
      });
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

  public async deleteService(serviceKey: string): Promise<ServerResponse<null>> {
    const url = `${baseUri}/${serviceKey}`;

    return this.delete<ServerResponse<null>>(url).then((response) => {
      const { data } = response;

      return data;
    });
  }
}
