import Api from '@/service/api';
import { showApiErrorModal } from '@/helper/api-errors';
import { AxiosResponse } from 'axios';
import { MessagesResponse, MessageThreadResponse } from '@/model/message';

const baseUri = '/action/messages';

export default class MessageApi extends Api {
  constructor() {
    super({ withCredentials: true });
  }

  public async find(
    page = 0, size = 10,
    dateFrom: string | null = null,
    dateTo: string | null = null,
    read: boolean | null = null,
  ): Promise<MessagesResponse> {
    const params = {
      page,
      size,
      'date-from': dateFrom,
      'date-to': dateTo,
      read,
    };

    const keyValues = Object.keys(params).filter((k) => !!params[k] || params[k] === false).map((k) => `${k}=${params[k]}`);

    const url = `${baseUri}?${keyValues.join('&')}`;

    return this.get<MessagesResponse>(url)
      .then((response: AxiosResponse<MessagesResponse>) => {
        const { data } = response;
        if (data.success === false) showApiErrorModal(data.messages);

        return data;
      });
  }

  public async getThread(threadKey: string): Promise<MessageThreadResponse> {
    const url = `${baseUri}/thread/${threadKey}`;

    return this.get<MessageThreadResponse>(url)
      .then((response: AxiosResponse<MessageThreadResponse>) => {
        const { data } = response;

        if (data.success === false) showApiErrorModal(data.messages);

        return data;
      });
  }
}
