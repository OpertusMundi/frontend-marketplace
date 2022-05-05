import Api from '@/service/api';
import { showApiErrorModal } from '@/helper/api-errors';
import {
  AxiosPageResponse, AxiosServerResponse, PageResult, ServerResponse,
} from '@/model/response';
import { Sorting } from '@/model/request';
import {
  EnumTransactionStatus,
} from '@/model/payin';
import {
  EnumPayOutSortField,
  PayOut,
} from '@/model/payout';

/**
 * Service for querying provider Payout records
 *
 * All service methods require user to have role ROLE_PROVIDER unless otherwise noted
 */
export default class ProviderPayOutApi extends Api {
  constructor() {
    super({ withCredentials: true });
  }

  /**
   * Get PayOut details
   *
   * @param payOutKey A unique PayOut key
   * @returns
   */
  public async getPayOut(payOutKey: string): Promise<ServerResponse<PayOut>> {
    const url = `/action/provider/payouts/${payOutKey}`;

    return this.get<ServerResponse<PayOut>>(url)
      .then((response: AxiosServerResponse<PayOut>) => {
        const { data } = response;
        if (data.success === false) showApiErrorModal(data.messages);

        return data;
      });
  }

  /**
   * Search provider PayOut records
   *
   * @param status
   * @param page
   * @param size
   * @param sorting
   * @returns
   */
  public async findPayOuts(
    status: EnumTransactionStatus | null = null, page = 0, size = 10, sorting: Sorting<EnumPayOutSortField>,
  ): Promise<AxiosPageResponse<PayOut>> {
    const { id: field, order } = sorting;

    const url = `/action/provider/payouts?page=${page}&size=${size}&status=${status || ''}&orderBy=${field}&order=${order}`;

    return this.get<ServerResponse<PageResult<PayOut>>>(url);
  }
}
