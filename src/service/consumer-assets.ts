import Api from '@/service/api';
import { saveAs } from 'file-saver';

/**
 * All service methods require user to have role ROLE_CONSUMER unless otherwise noted
 */
export default class ConsumerAssetsApi extends Api {
  constructor() {
    super({ withCredentials: true });
  }

  /**
   * Get Order details (ROLE_CONSUMER is required)
   *
   * @param assetId Asset ID
   * @param orderKey A unique Order key
   * @returns
   */
  public async downloadResource(assetId: string, resourceKey: string): Promise<null> {
    const url = `/action/consumer/assets/${assetId}/resource/${resourceKey}`;

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
