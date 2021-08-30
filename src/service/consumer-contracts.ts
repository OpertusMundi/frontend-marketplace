import { AxiosServerResponse, ServerResponse } from '@/model';
import Api from '@/service/api';

export default class ConsumerContractsApi extends Api {
  constructor() {
    super({ withCredentials: true });
  }

  public async printContract(key: string, index: number): Promise<AxiosServerResponse<BinaryType>> {
    const url = `/action/contract/consumer/order/${key}?index=${index}`;

    return this.get<ServerResponse<BinaryType>>(url);
  }
}
