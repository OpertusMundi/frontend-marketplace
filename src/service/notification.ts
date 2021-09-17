import Api from '@/service/api';

import { AxiosServerResponse, ServerResponse } from '@/model/response';
import { AxiosResponse } from 'axios';
import { EnumNotificationSortField, NotificationQueryResponse } from '@/model/notification';

export default class NotificationApi extends Api {
  constructor() {
    super({ withCredentials: true });
  }

  public async find(
    page = 0, size = 10, dateFrom: string | null = null, dateTo: string | null = null,
    read: boolean | null = null, orderBy = EnumNotificationSortField.SEND_AT, order: 'ASC' | 'DESC' = 'DESC',
  ): Promise<NotificationQueryResponse> {
    const params = {
      page,
      size,
      'date-from': dateFrom,
      'date-to': dateTo,
      read,
    };

    const keyValues = Object.keys(params).filter((k) => !!params[k] || params[k] === false).map((k) => `${k}=${params[k]}`);

    const url = `/action/notifications?${keyValues.join('&')}&orderBy=${orderBy}&order=${order}`;

    return this.get<NotificationQueryResponse>(url)
      .then((response: AxiosResponse<NotificationQueryResponse>) => {
        const { data } = response;

        return data;
      });
  }

  public async readNotification(key: string): Promise<ServerResponse<Notification>> {
    const url = `/action/notifications/${key}`;

    return this.put<unknown, ServerResponse<Notification>>(url, null)
      .then((response: AxiosServerResponse<Notification>) => {
        const { data } = response;

        return data;
      });
  }
}
