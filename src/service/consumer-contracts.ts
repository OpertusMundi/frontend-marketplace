import { AxiosServerResponse, ServerResponse } from '@/model';
import Api from '@/service/api';

export default class ConsumerContractsApi extends Api {
  constructor() {
    super({ withCredentials: true });
  }

  public async printContract(key: string, index: number): Promise<AxiosServerResponse<BinaryType>> {
    const url = `/action/contract/consumer/order/${key}?index=${index}`;

    return this.post<void, ServerResponse<BinaryType>>(url, null, {
      responseType: 'blob',
    });
  }

  public async downloadContract(key: string, index: number, signed: boolean): Promise<AxiosServerResponse<BinaryType>> {
    const url = `/action/contract/consumer/order/${key}?index=${index}&signed=${signed}`;

    return this.get<ServerResponse<BinaryType>>(url, {
      responseType: 'blob',
    });
  }
}
