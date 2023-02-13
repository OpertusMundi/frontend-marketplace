import { TobieUserMessage, TobieResponse } from '@/model/tobie';
import Api from './api';

export default class TobieApi extends Api {
  public async sendMessage(message: TobieUserMessage): Promise<TobieResponse> {
    const url = 'https://tobie.beta.topio.market/webhooks/rest/webhook';

    return this.post<TobieUserMessage, TobieResponse[]>(url, message).then((response) => {
      const { data } = response;

      return data[0];
    });
  }
}
