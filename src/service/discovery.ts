import Api from '@/service/api';
import { showApiErrorModal } from '@/helper/api-errors';
import { ServerResponse } from '@/model/response';
import { DiscoveryResult } from '@/model/discovery';

const baseUri = '/action/discovery';

export default class DiscoveryApi extends Api {
  constructor() {
    super({ withCredentials: true });
  }

  public async find(assetId: string): Promise<ServerResponse<DiscoveryResult>> {
    const url = `${baseUri}/joinable/${assetId}`;

    return this.get<ServerResponse<DiscoveryResult>>(url)
      .then((response) => {
        const { data } = response;

        if (data.success === false) showApiErrorModal(data.messages);

        return data;
      });
  }
}
