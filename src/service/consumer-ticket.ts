import Api from '@/service/api';
import { showApiErrorModal } from '@/helper/api-errors';
import {
  AxiosServerResponse, ServerResponse,
} from '@/model/response';
import { ConsumerTicketCommand } from '@/model/consumer-ticket';
import { Message } from '@/model/message';

export default class ConsumerTicketApi extends Api {
  constructor() {
    super({ withCredentials: true });
  }

  /**
    Opens a ticket to Helpdesk from the authenticated user. Required role: ROLE_USER, ROLE_VENDOR_USER
   */
  public async openTicket(ticketData: ConsumerTicketCommand): Promise<ServerResponse<Message>> {
    const url = '/action/consumer/tickets';

    return this.post<ConsumerTicketCommand, ServerResponse<Message>>(url, ticketData)
      .then((response: AxiosServerResponse<Message>) => {
        const { data } = response;
        if (data.success === false) showApiErrorModal(data.messages);

        return data;
      });
  }
}
