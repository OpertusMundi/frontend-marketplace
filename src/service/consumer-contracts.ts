import { ServerResponse } from '@/model';
import processResponse from '@/helper/axios-response';
import Api from '@/service/api';

export default class ConsumerContractsApi extends Api {
  constructor() {
    super({ withCredentials: true });
  }

  public async downloadContract(key: string, index = 1, save = false, downloadFilename?: string): Promise<ServerResponse<Blob>> {
    const url = `/action/contract/consumer/order/${key}?index=${index}`;

    const response = this.post<void, Blob>(url, null, {
      responseType: 'blob',
    });

    return processResponse(response, save, downloadFilename);
  }
}
