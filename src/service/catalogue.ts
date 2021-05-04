import Api from '@/service/api';

import { AxiosServerResponse, ServerResponse, SimpleResponse } from '@/model/response';
import {
  CatalogueQuery, CatalogueQueryResponse, CatalogueItem, QueryResultPage,
} from '@/model';
import { AxiosResponse } from 'axios';
import {
  CatalogueHarvestCommand, CatalogueHarvestImportCommand, ElasticCatalogueQuery, EnumCatalogueType, EnumElasticSearchSortField, Publisher,
} from '@/model/catalogue';
import { HarvestImportResponse } from '@/model/draft';

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
    const data: CatalogueQuery = typeof query === 'string' ? { query, page, size } : query;

    const params = Object.keys(data).map((k) => `${k}=${params[k]}`);

    const url = `/action/catalogue?${params.join('&')}`;

    return this.get<CatalogueQueryResponseInternal>(url)
      .then((response: AxiosResponse<CatalogueQueryResponseInternal>) => {
        const { data: serverResponse } = response;

        // Inject publishers
        if (serverResponse.success) {
          serverResponse.result.items = serverResponse.result.items.map((item) => ({
            ...item,
            publisher: serverResponse.publishers[item.publisherId],
          }));
        }

        return serverResponse;
      });
  }

  public async findAdvanced(query: Partial<ElasticCatalogueQuery>): Promise<CatalogueQueryResponse> {
    // Set defaults
    const queryWithDefaults: Partial<ElasticCatalogueQuery> = {
      page: 0,
      size: 10,
      orderBy: EnumElasticSearchSortField.SCORE,
      order: 'DESC',
      ...query,
    };

    const params = Object.keys(queryWithDefaults)
      .map((k) => `${k}=${Array.isArray(params[k]) ? params[k].join(',') : params[k]}`);

    const url = `/action/catalogue/advanced?${params.join('&')}`;

    return this.get<CatalogueQueryResponseInternal>(url)
      .then((response: AxiosResponse<CatalogueQueryResponseInternal>) => {
        const { data: serverResponse } = response;

        // Inject publishers
        if (serverResponse.success) {
          serverResponse.result.items = serverResponse.result.items.map((item) => ({
            ...item,
            publisher: serverResponse.publishers[item.publisherId],
          }));
        }

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

  public async harvest(command: CatalogueHarvestCommand): Promise<SimpleResponse> {
    const url = '/action/catalogue/harvest';

    return this.post<CatalogueHarvestCommand, SimpleResponse>(url, {
      ...command,
      type: command.type || EnumCatalogueType.CSW,
    }).then((response: AxiosResponse<SimpleResponse>) => {
      const { data } = response;

      return data;
    });
  }

  public async findHarvested(catalogueUrl: string, page = 0, size = 10, query = ''): Promise<CatalogueQueryResponse> {
    const url = `/action/catalogue/harvest?url=${catalogueUrl}&page=${page}&size=${size}&query=${query}`;

    return this.get<CatalogueQueryResponseInternal>(url)
      .then((response: AxiosResponse<CatalogueQueryResponseInternal>): CatalogueQueryResponse => {
        const { data } = response;

        // Ignore publishers
        return data as CatalogueQueryResponse;
      });
  }

  public async importHarvested(command: CatalogueHarvestImportCommand): Promise<HarvestImportResponse> {
    const url = '/action/catalogue/harvest/import';

    return this.post<CatalogueHarvestImportCommand, HarvestImportResponse>(url, command)
      .then((response: AxiosResponse<HarvestImportResponse>) => {
        const { data } = response;

        return data;
      });
  }
}
