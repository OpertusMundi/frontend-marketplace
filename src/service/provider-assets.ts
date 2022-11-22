import Api from '@/service/api';
import { AxiosResponse } from 'axios';
import { CatalogueQueryResponse } from '@/model';
import { AxiosServerResponse, ServerResponse } from '@/model/response';
import { ProviderDraftQuery } from '@/model/provider-assets';
import { showApiErrorModal } from '@/helper/api-errors';
import { saveAs } from 'file-saver';

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

    const queryString = `q=${query.q}&type=${query.type || ''}&page=${page}&size=${size}&orderBy=${field}&order=${order}`;
    const url = `/action/assets?${queryString}`;

    return this.get<CatalogueQueryResponse>(url)
      .then((response: AxiosResponse<CatalogueQueryResponse>) => {
        const { data } = response;
        if (data.success === false) showApiErrorModal(data.messages);

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

  /**
   * Download contract file
   *
   * @param assetId Asset ID
   * @returns
  */
  public async downloadContract(assetId: string): Promise<null> {
    const url = `/action/assets/${assetId}/contract`;

    return this.get<File>(url, { responseType: 'blob' })
      .then((response) => {
        const { data } = response;
        // if (data.success === false) showApiErrorModal(data.messages);

        const contentDisposition = response.headers['content-disposition'];
        const fileName = this.getFilenameFromHeader(contentDisposition);
        saveAs(data, fileName);
        return null;
      });
  }

  private getFilenameFromHeader(header: string | null): string {
    const defaultName = 'contract.pdf';
    if (!header) {
      return defaultName;
    }
    const filenamePart = header.split(';')[1];
    if (!filenamePart) {
      return defaultName;
    }
    return filenamePart.split('filename')[1].split('=')[1].trim();
  }
}
