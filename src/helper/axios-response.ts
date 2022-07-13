import { AxiosError, AxiosResponse } from 'axios';
import { ServerResponse } from '@/model';
import { blobToJson } from './file';

function getFilenameFromHeader(header: string | null): string {
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

export default async function processResponse(
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
        const filename = downloadFilename || getFilenameFromHeader(contentDisposition);

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
