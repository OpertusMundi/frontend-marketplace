import Api from '@/service/api';

import {
  AxiosPageResponse, AxiosServerResponse, PageResult, ServerResponse,
} from '@/model/response';
import { Sorting } from '@/model/request';
import {
  EnumOrderStatus,
  EnumOrderSortField,
  ConsumerOrder,
} from '@/model/order';

/**
 * All service methods require user to have role ROLE_CONSUMER unless otherwise noted
 */
export default class ConsumerOrderApi extends Api {
  constructor() {
    super({ withCredentials: true });
  }

  /**
   * Get Order details (ROLE_CONSUMER is required)
   *
   * @param orderKey A unique Order key
   * @returns
   */
  public async getOrder(orderKey: string): Promise<ServerResponse<ConsumerOrder>> {
    const url = `/action/consumer/orders/${orderKey}`;

    return this.get<ServerResponse<ConsumerOrder>>(url)
      .then((response: AxiosServerResponse<ConsumerOrder>) => {
        const { data } = response;

        return data;
      });
  }

  /**
   * Search consumer Order records (ROLE_CONSUMER is required)
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
  ): Promise<AxiosPageResponse<ConsumerOrder>> {
    const { id: field, order } = sorting;

    const endpoint = '/action/consumer/orders';
    const pagination = `page=${page}&size=${size}&orderBy=${field}&order=${order}`;
    const filters = `status=${status ? status.join(',') : ''}&referenceNumber=${referenceNumber || ''}`;
    const url = `${endpoint}?${filters}&${pagination}`;

    return this.get<ServerResponse<PageResult<ConsumerOrder>>>(url);
  }

  /**
   * Confirm order delivery
   *
   * @param orderKey
   * @returns
   */
  public async confirmDelivery(orderKey: string): Promise<ServerResponse<ConsumerOrder>> {
    const url = `/action/consumer/orders/${orderKey}/confirm-delivery`;

    return this.put<void, ServerResponse<ConsumerOrder>>(url)
      .then((response: AxiosServerResponse<ConsumerOrder>) => {
        const { data } = response;

        return data;
      });
  }

  /**
   * Accept order contract
   *
   * @param orderKey
   * @returns
   */
  public async acceptContract(orderKey: string): Promise<ServerResponse<ConsumerOrder>> {
    const url = `/action/consumer/orders/${orderKey}/accept-contract`;

    return this.put<void, ServerResponse<ConsumerOrder>>(url)
      .then((response: AxiosServerResponse<ConsumerOrder>) => {
        const { data } = response;

        return data;
      });
  }
}
