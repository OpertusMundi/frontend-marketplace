import Api from '@/service/api';

import { AxiosServerResponse, ServerResponse } from '@/model/response';
import { CatalogueItemDetails } from '@/model/catalogue';

export default class HelpdeskDraftApi extends Api {
  constructor() {
    super({ withCredentials: true });
  }

  /**
   * Get a single draft by its key
   *
   * @param key
   */
  public async findOne(key: string): Promise<ServerResponse<CatalogueItemDetails>> {
    const url = `/action/helpdesk-drafts/${key}`;

    return this.get<ServerResponse<CatalogueItemDetails>>(url)
      .then((response: AxiosServerResponse<CatalogueItemDetails>) => {
        const { data } = response;

        return data;
      });
  }
}
