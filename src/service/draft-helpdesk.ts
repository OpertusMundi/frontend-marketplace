import { AxiosError, AxiosResponse } from 'axios';

import Api from '@/service/api';
import { showApiErrorModal } from '@/helper/api-errors';
import { AxiosServerResponse, ServerResponse } from '@/model/response';
import { CatalogueItemDetails } from '@/model/catalogue';
import { blobToJson } from '@/helper/file';

export default class HelpdeskDraftApi extends Api {
  constructor() {
    super({ withCredentials: true });
  }

  /**
   * Get a single draft by its key
   *
   * @param key
   */
  public async findOne(key: string): Promise<ServerResponse<CatalogueItemDetails>> {
    const url = `/action/helpdesk-drafts/${key}`;

    return this.get<ServerResponse<CatalogueItemDetails>>(url)
      .then((response: AxiosServerResponse<CatalogueItemDetails>) => {
        const { data } = response;
        if (data.success === false) showApiErrorModal(data.messages);

        return data;
      });
  }

  /**
   * Download additional resource file
   *
   * @param draftKey
   * @param resourceKey
   * @param save
   */
  public async downloadAdditionalResource(draftKey: string, resourceKey: string, save = true): Promise<ServerResponse<Blob>> {
    const url = `/action/helpdesk-drafts/${draftKey}/additional-resources/${resourceKey}`;

    const response = this.get<Blob>(url, {
      responseType: 'blob',
    });

    return this.processResponse(response, save);
  }

  /**
   * Download provider uploaded contract file
   *
   * @param draftKey
   * @param save
   */
  public async downloadContract(draftKey: string, save = true): Promise<ServerResponse<Blob>> {
    const url = `/action/helpdesk-drafts/${draftKey}/contract`;

    const response = this.get<Blob>(url, {
      responseType: 'blob',
    });

    return this.processResponse(response, save);
  }

  /**
   * Download contract annex file
   *
   * @param draftKey
   * @param annexKey
   * @param save
   */
  public async downloadContractAnnex(draftKey: string, annexKey: string, save = true): Promise<ServerResponse<Blob>> {
    const url = `/action/helpdesk-drafts/${draftKey}/contract/annexes/${annexKey}`;

    const response = this.get<Blob>(url, {
      responseType: 'blob',
    });

    return this.processResponse(response, save);
  }

  private async processResponse(
    serverResponse: Promise<AxiosResponse<Blob>>, save: boolean, downloadFilename?: string,
  ): Promise<ServerResponse<Blob>> {
    /**
     * All header names are lower cased and can be accessed using the bracket notation.
     *
     * See https://github.com/axios/axios#response-schema
     */
    return serverResponse
      .then((response: AxiosResponse<Blob>) => {
        if (save) {
          const contentDisposition = response.headers['content-disposition'];
          const filename = downloadFilename || this.getFilenameFromHeader(contentDisposition);

          saveAs(response.data, filename);
        }

        return Promise.resolve({
          success: true,
          messages: [],
          result: response.data,
        });
      })
      .catch((err: AxiosError) => blobToJson(err.response?.data));
  }

  private getFilenameFromHeader(header: string | null): string {
    const defaultName = 'download.pdf';
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
