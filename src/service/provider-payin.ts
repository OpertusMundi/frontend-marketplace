import Api from '@/service/api';
import { showApiErrorModal } from '@/helper/api-errors';
import {
  AxiosPageResponse, AxiosServerResponse, PageResult, ServerResponse,
} from '@/model/response';
import { Sorting } from '@/model/request';
import {
  EnumPayInItemSortField,
  EnumTransactionStatus,
  ProviderPayInItem,
} from '@/model/payin';

/**
 * Service for querying provider payments.
 *
 * A consumer PayIn may contain more than one items that reference several providers.
 * The service returns PayIn items for the currently authenticated provider.
 *
 * All service methods require user to have role ROLE_PROVIDER unless otherwise noted
 */
export default class ProviderPayInItemApi extends Api {
  constructor() {
    super({ withCredentials: true });
  }

  /**
   * Get PayIn item details
   *
   * @param payInKey A unique PayIn key
   * @param index PayIn item index (Index is 1-based)
   * @returns
   */
  public async getPayInItem(payInKey: string, index: number): Promise<ServerResponse<ProviderPayInItem>> {
    const url = `/action/provider/payins/${payInKey}/${index}`;

    return this.get<ServerResponse<ProviderPayInItem>>(url)
      .then((response: AxiosServerResponse<ProviderPayInItem>) => {
        const { data } = response;
        if (data.success === false) showApiErrorModal(data.messages);

        return data;
      });
  }

  /**
   * Search provider PayIn item records
   *
   * @param status
   * @param page
   * @param size
   * @param sorting
   * @returns
   */
  public async findPayIns(
    status: EnumTransactionStatus | null = null, page = 0, size = 10, sorting: Sorting<EnumPayInItemSortField>,
  ): Promise<AxiosPageResponse<ProviderPayInItem>> {
    const { id: field, order } = sorting;

    const url = `/action/provider/payins?page=${page}&size=${size}&status=${status || ''}&orderBy=${field}&order=${order}`;

    return this.get<ServerResponse<PageResult<ProviderPayInItem>>>(url);
  }
}
