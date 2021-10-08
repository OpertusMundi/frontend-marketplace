import Api from '@/service/api';
import { AxiosResponse } from 'axios';
import { CatalogueQueryResponse } from '@/model';
import { AxiosServerResponse, ServerResponse } from '@/model/response';
import { ProviderDraftQuery } from '@/model/provider-assets';

export default class ProviderAssetsApi extends Api {
  constructor() {
    super({ withCredentials: true });
  }

  /**
   *
   */
  public async find(query: ProviderDraftQuery): Promise<CatalogueQueryResponse> {
    const { page, size } = query.pageRequest;
    const { id: field, order } = query.sorting;

    const queryString = `q=${query.q}&type=${query.type}&page=${page}&size=${size}&orderBy=${field}&order=${order}`;
    const url = `/action/assets?${queryString}`;

    return this.get<CatalogueQueryResponse>(url)
      .then((response: AxiosResponse<CatalogueQueryResponse>) => {
        const { data } = response;

        return data;
      });
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

  /**
   * Downloads an additional resource file
   *
   * @param pid
   * @param resourceKey
   */
  public async downloadAdditionalResource(pid: string, resourceKey: string): Promise<AxiosServerResponse<BinaryType>> {
    const url = `/action/assets/${pid}/additional-resources/${resourceKey}`;

    return this.get(url, { responseType: 'blob' });
  }
}
