import Api from '@/service/api';

import {
  AxiosPageResponse, AxiosServerResponse, PageResult, ServerResponse,
} from '@/model/response';
import { Sorting } from '@/model/request';
import {
  EnumOrderStatus,
  EnumOrderSortField,
  Order,
} from '@/model/order';

/**
 * Service for querying provider orders.
 *
 * All service methods require user to have role ROLE_PROVIDER unless otherwise noted
 */
export default class ProviderOrderApi extends Api {
  constructor() {
    super({ withCredentials: true });
  }

  /**
   * Get Order details
   *
   * @param orderKey A unique Order key
   * @returns
   */
  public async getOrder(orderKey: string): Promise<ServerResponse<Order>> {
    const url = `/action/provider/orders/${orderKey}`;

    return this.get<ServerResponse<Order>>(url)
      .then((response: AxiosServerResponse<Order>) => {
        const { data } = response;

        return data;
      });
  }

  /**
   * Search provider Order records
   *
   * @param status
   * @param page
   * @param size
   * @param sorting
   * @returns
   */
  public async findOrders(
    status: EnumOrderStatus[] | null = null, referenceNumber: string | null = null,
    page = 0, size = 10, sorting: Sorting<EnumOrderSortField>,
  ): Promise<AxiosPageResponse<Order>> {
    const { id: field, order } = sorting;

    const endpoint = '/action/provider/orders';
    const pagination = `page=${page}&size=${size}&orderBy=${field}&order=${order}`;
    const filters = `status=${status ? status.join(',') : ''}&referenceNumber=${referenceNumber || ''}`;
    // const url = endpoint + '?' + filters + '&' + pagination;
    const url = `${endpoint}?${filters}&${pagination}`;

    return this.get<ServerResponse<PageResult<Order>>>(url);
  }
}
