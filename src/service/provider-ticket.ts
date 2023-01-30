import Api from '@/service/api';
import { showApiErrorModal } from '@/helper/api-errors';
import {
  AxiosServerResponse, ServerResponse,
} from '@/model/response';
import { ProviderTicketCommand } from '@/model/provider-ticket';
import { Message } from '@/model/message';

export default class ProviderTicketApi extends Api {
  constructor() {
    super({ withCredentials: true });
  }

  /**
    Opens a ticket to Helpdesk from the authenticated user. Required role: ROLE_PROVIDER, ROLE_VENDOR_PROVIDER
   */
  public async openTicket(ticketData: ProviderTicketCommand): Promise<ServerResponse<Message>> {
    const url = '/action/provider/tickets';

    return this.post<ProviderTicketCommand, ServerResponse<Message>>(url, ticketData)
      .then((response: AxiosServerResponse<Message>) => {
        const { data } = response;
        if (data.success === false) showApiErrorModal(data.messages);

        return data;
      });
  }
}
