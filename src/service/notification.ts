import Api from '@/service/api';
import { showApiErrorModal } from '@/helper/api-errors';
import { AxiosServerResponse, ServerResponse, SimpleResponse } from '@/model/response';
import { AxiosResponse } from 'axios';
import { EnumNotificationSortField, NotificationQueryResponse } from '@/model/notification';

const baseUri = '/action/notifications';

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

    const url = `${baseUri}?${keyValues.join('&')}&orderBy=${orderBy}&order=${order}`;

    return this.get<NotificationQueryResponse>(url)
      .then((response: AxiosResponse<NotificationQueryResponse>) => {
        const { data } = response;
        if (data.success === false) showApiErrorModal(data.messages);

        return data;
      });
  }

  public async readNotification(key: string): Promise<ServerResponse<Notification>> {
    const url = `${baseUri}/${key}`;

    return this.put<unknown, ServerResponse<Notification>>(url, null)
      .then((response: AxiosServerResponse<Notification>) => {
        const { data } = response;
        if (data.success === false) showApiErrorModal(data.messages);

        return data;
      });
  }

  public async readAllNotifications(): Promise<SimpleResponse> {
    const url = baseUri;

    return this.put<unknown, SimpleResponse>(url, null)
      .then((response: AxiosResponse<SimpleResponse>) => {
        const { data } = response;
        if (data.success === false) showApiErrorModal(data.messages);

        return data;
      });
  }
}
