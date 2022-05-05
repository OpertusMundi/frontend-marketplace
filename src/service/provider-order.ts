import { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';

import Api from '@/service/api';
import { showApiErrorModal } from '@/helper/api-errors';
import {
  AxiosPageResponse, AxiosServerResponse, PageResult, ServerResponse,
} from '@/model/response';
import { Sorting } from '@/model/request';
import {
  EnumOrderStatus,
  EnumOrderSortField,
  ProviderOrder,
  OrderShippingCommand,
} from '@/model/order';
import { blobToJson } from '@/helper/file';

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
  public async getOrder(orderKey: string): Promise<ServerResponse<ProviderOrder>> {
    const url = `/action/provider/orders/${orderKey}`;

    return this.get<ServerResponse<ProviderOrder>>(url)
      .then((response: AxiosServerResponse<ProviderOrder>) => {
        const { data } = response;
        if (data.success === false) showApiErrorModal(data.messages);

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
  ): Promise<AxiosPageResponse<ProviderOrder>> {
    const { id: field, order } = sorting;

    const endpoint = '/action/provider/orders';
    const pagination = `page=${page}&size=${size}&orderBy=${field}&order=${order}`;
    const filters = `status=${status ? status.join(',') : ''}&referenceNumber=${referenceNumber || ''}`;
    // const url = endpoint + '?' + filters + '&' + pagination;
    const url = `${endpoint}?${filters}&${pagination}`;

    return this.get<ServerResponse<PageResult<ProviderOrder>>>(url);
  }

  /**
   *  Accept or Reject an Order with vetting required
   *
   * @param orderKey
   * @param accepted
   * @param rejectionReason
   */
  public async acceptOrRejectOrder(orderKey: string, accepted: boolean, rejectionReason?: string): Promise<ServerResponse<ProviderOrder>> {
    const url = `/action/provider/orders/${orderKey}/confirmation`;

    const command = accepted ? { rejected: false } : { rejected: true, reason: rejectionReason };

    return this.put<{ rejected: boolean, reason?: string }, ServerResponse<ProviderOrder>>(url, command)
      .then((response: AxiosServerResponse<ProviderOrder>) => {
        const { data } = response;
        if (data.success === false) showApiErrorModal(data.messages);

        return data;
      });
  }

  /**
   * Confirm order shipping
   *
   * @param orderKey
   * @param command
   * @returns
   */
  public async confirmShipping(orderKey: string, command?: OrderShippingCommand): Promise<ServerResponse<ProviderOrder>> {
    const url = `/action/provider/orders/${orderKey}/shipping`;

    return this.put<OrderShippingCommand, ServerResponse<ProviderOrder>>(url, command || {})
      .then((response: AxiosServerResponse<ProviderOrder>) => {
        const { data } = response;
        if (data.success === false) showApiErrorModal(data.messages);

        return data;
      });
  }

  /**
   * Upload order contract
   *
   * @param orderKey Order key
   * @param resource File to upload
   * @param submit True if this is the final contract version
   */
  public async uploadOrderContract(
    orderKey: string, resource: File, submit = false, config?: AxiosRequestConfig,
  ): Promise<ServerResponse<ProviderOrder>> {
    const url = `/action/provider/orders/${orderKey}/contract`;

    const form = new FormData();

    form.append('file', resource);

    const requestConfig = {
      ...config,
      headers: { 'Content-Type': 'multipart/form-data' },
    };

    return (submit
      ? this.post<FormData, ServerResponse<ProviderOrder>>(url, form, requestConfig)
      : this.put<FormData, ServerResponse<ProviderOrder>>(url, form, requestConfig)
    ).then((response: AxiosServerResponse<ProviderOrder>) => {
      const { data } = response;

      return data;
    });
  }

  /**
   * Download provider contract file
   *
   * @param orderKey
   */
  public async downloadContract(orderKey: string, save = true): Promise<ServerResponse<Blob>> {
    const url = `/action/provider/orders${orderKey}/contract`;

    return this.get<Blob>(url, {
      responseType: 'blob',
    }).then((response: AxiosResponse<Blob>) => {
      if (save) {
        const contentDisposition = response.headers['content-disposition'];
        const filename = this.getFilenameFromHeader(contentDisposition);

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
    const defaultName = 'download.pdf';
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
