import Api from '@/service/api';

import { AxiosServerResponse, ServerResponse } from '@/model/response';

export default class ProviderAssetsApi extends Api {
  constructor() {
    super({ withCredentials: true });
  }

  /**
   * Delete asset.
   *
   * @param key
   */
  public async deleteAsset(id: string): Promise<AxiosServerResponse<void>> {
    const url = `/action/assets/${id}`;

    return this.delete<ServerResponse<void>>(url);
  }
}
