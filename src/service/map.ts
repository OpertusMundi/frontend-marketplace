import Api from '@/service/api';
import { showApiErrorModal } from '@/helper/api-errors';
import { ServerResponse, PageResult } from '@/model/response';
import { AxiosResponse } from 'axios';
import { TopioMap } from '@/model/map';

const baseUri = '/action/maps';

export default class MapsApi extends Api {
  constructor() {
    super({ withCredentials: true });
  }

  public async getMaps(page: number, size: number): Promise<ServerResponse<PageResult<TopioMap>>> {
    const url = `${baseUri}?page=${page}&size=${size}`;

    return this.get<ServerResponse<PageResult<TopioMap>>>(url)
      .then((response: AxiosResponse<ServerResponse<PageResult<TopioMap>>>) => {
        const { data } = response;
        if (data.success === false) showApiErrorModal(data.messages);

        return data;
      });
  }
}
