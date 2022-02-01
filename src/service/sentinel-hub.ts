import Api from '@/service/api';

import { AxiosServerResponse, ServerResponse } from '@/model/response';
import { ClientCatalogueQuery, SentinelHubCatalogueResponse, SubscriptionPlan } from '@/model/sentinel-hub';

const baseUri = '/action/integration/sentinel-hub';

export default class QuotationApi extends Api {
  constructor() {
    super({ withCredentials: true });
  }

  /**
   * Get all available subscription plans for open data collections.
   *
   * Required role: `ROLE_USER`
   *
   * @returns
   */
  public async getSubscriptionPlans(): Promise<ServerResponse<SubscriptionPlan[]>> {
    const url = `${baseUri}/quotation/subscriptions`;

    return this.get<ServerResponse<SubscriptionPlan[]>>(url)
      .then((response: AxiosServerResponse<SubscriptionPlan[]>) => {
        const { data } = response;

        return data;
      });
  }

  /**
   * Search satellite images from Sentinel Hub using the Catalogue API.
   *
   * Required role: `ROLE_USER`
   *
   * @param query The search criteria
   * @returns
   */
  public async search(query: ClientCatalogueQuery): Promise<ServerResponse<SentinelHubCatalogueResponse>> {
    const url = `${baseUri}/catalogue/search`;

    return this.post<ClientCatalogueQuery, ServerResponse<SentinelHubCatalogueResponse>>(url, query)
      .then((response: AxiosServerResponse<SentinelHubCatalogueResponse>) => {
        const { data } = response;

        return data;
      });
  }
}
