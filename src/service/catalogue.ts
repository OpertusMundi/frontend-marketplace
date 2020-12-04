import Api from '@/service/api';

import { AxiosServerResponse, ServerResponse } from '@/model/response';
import {
  CatalogueQuery, CatalogueQueryResponse, CatalogueItem, QueryResultPage,
} from '@/model';
import { AxiosResponse } from 'axios';
import { Publisher } from '@/model/catalogue';

// Custom response types
interface CatalogueQueryResponseInternal extends ServerResponse<QueryResultPage<CatalogueItem>> {
  /*
   * Map with all publishers for all items in the response
   */
  publishers: { [key: string]: Publisher };
}

export default class CatalogueApi extends Api {
  constructor() {
    super({ withCredentials: true });
  }

  public async find(query: string | CatalogueQuery, page = 0, size = 10): Promise<CatalogueQueryResponse> {
    const url = '/action/catalogue';

    const data: CatalogueQuery = typeof query === 'string' ? { query, page, size } : query;

    return this.post<CatalogueQuery, CatalogueQueryResponseInternal>(url, data)
      .then((response: AxiosResponse<CatalogueQueryResponseInternal>) => {
        const { data: serverResponse } = response;

        // Inject publishers
        if (serverResponse.success) {
          serverResponse.result.items = serverResponse.result.items.map((item) => ({
            ...item,
            publisher: serverResponse.publishers[item.publisherId],
          }));
        }
        console.log(serverResponse);

        return serverResponse;
      });
  }

  public async findOne(id: string): Promise<ServerResponse<CatalogueItem>> {
    const url = `/action/catalogue/items/${id}`;

    return this.get<ServerResponse<CatalogueItem>>(url)
      .then((response: AxiosServerResponse<CatalogueItem>) => {
        const { data } = response;

        return data;
      });
  }
}
