import Api from '@/service/api';
import { showApiErrorModal } from '@/helper/api-errors';
import { AxiosResponse } from 'axios';
import { ServerResponse } from '@/model/response';
import { MessagesResponse, MessageThreadResponse, Message } from '@/model/message';

const baseUri = '/action/messages';

export default class MessageApi extends Api {
  constructor() {
    super({ withCredentials: true });
  }

  public async find(
    page = 0, size = 10,
    dateFrom: string | null = null,
    dateTo: string | null = null,
    status: 'ALL' | 'UNREAD' | 'THREAD_ONLY' | 'THREAD_ONLY_UNREAD' | null = null,
  ): Promise<MessagesResponse> {
    const params = {
      page,
      size,
      'date-from': dateFrom,
      'date-to': dateTo,
      status,
    };

    const keyValues = Object.keys(params).filter((k) => !!params[k] || params[k] === false || params[k] === 0)
      .map((k) => `${k}=${params[k]}`);

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

  public async replyToMessage(threadKey: string, text: string): Promise<ServerResponse<Message>> {
    const url = `${baseUri}/thread/${threadKey}`;

    return this.post<{ text: string }, ServerResponse<Message>>(url, { text })
      .then((response: AxiosResponse<ServerResponse<Message>>) => {
        const { data } = response;

        if (data.success === false) showApiErrorModal(data.messages);

        return data;
      });
  }

  public async markThreadAsRead(threadKey: string): Promise<MessagesResponse> {
    const url = `${baseUri}/thread/${threadKey}`;

    return this.put<void, MessagesResponse>(url, null)
      .then((response) => {
        const { data } = response;

        return data;
      });
  }
}
