import { AxiosError, AxiosResponse } from 'axios';
import { ServerResponse } from '@/model';
import { blobToJson } from '@/helper/file';
import Api from '@/service/api';

export default class ConsumerContractsApi extends Api {
  constructor() {
    super({ withCredentials: true });
  }

  public async printContract(key: string, index = 1, save = false, downloadFilename?: string): Promise<ServerResponse<Blob>> {
    const url = `/action/contract/consumer/order/${key}?index=${index}`;

    const response = this.post<void, Blob>(url, null, {
      responseType: 'blob',
    });

    return this.processResponse(response, save, downloadFilename);
  }

  public async downloadContract(
    key: string, index = 1, signed: boolean, save = false, downloadFilename?: string,
  ): Promise<ServerResponse<Blob>> {
    const url = `/action/contract/consumer/order/${key}?index=${index}&signed=${signed}`;

    const response = this.get<Blob>(url, {
      responseType: 'blob',
    });

    return this.processResponse(response, save, downloadFilename);
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
