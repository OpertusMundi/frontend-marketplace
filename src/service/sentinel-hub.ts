import Api from '@/service/api';
import { AxiosResponse } from 'axios';
import convert from 'xml-js';
import { showApiErrorModal } from '@/helper/api-errors';
import { AxiosServerResponse, ServerResponse } from '@/model/response';
import {
  ClientCatalogueQuery,
  SentinelHubCatalogueResponse,
  SHCollection,
  SubscriptionPlan,
  WMSLayer,
} from '@/model/sentinel-hub';

const baseUri = '/action/integration/sentinel-hub';

export default class SentinelHubApi extends Api {
  constructor() {
    super({ withCredentials: true });
  }

  /**
   * Get all open data collections
   *
   * @returns
   */
  public async getOpenDataCollections(): Promise<ServerResponse<SHCollection[]>> {
    const url = `${baseUri}/open-data/collections`;

    return this.get<ServerResponse<SHCollection[]>>(url)
      .then((response) => {
        const { data } = response;
        if (data.success === false) showApiErrorModal(data.messages);

        return data;
      });
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
        if (data.success === false) showApiErrorModal(data.messages);

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
        if (data.success === false) showApiErrorModal(data.messages);

        return data;
      });
  }

  /**
   * Check if the authenticated user has already an active subscription to Sentinel Hub service
   *
   * Required role: `ROLE_USER`
   *
   * @returns
   */
  public async isSubscribed(): Promise<ServerResponse<boolean>> {
    const url = `${baseUri}/subscriptions`;

    return this.get<ServerResponse<boolean>>(url)
      .then((response: AxiosServerResponse<boolean>) => {
        const { data } = response;
        if (data.success === false) showApiErrorModal(data.messages);

        return data;
      });
  }

  getAvailableWMSLayersByInstanceID(instanceID: string): Promise<WMSLayer[]> {
    const endpoint = `https://services.sentinel-hub.com/ogc/wms/${instanceID}`;

    return this.get<string>(`${endpoint}?request=GetCapabilities`)
      .then((response: AxiosResponse<string>) => {
        const { data: dataXML } = response;

        const dataJSON = JSON.parse(convert.xml2json(dataXML));

        const layers: WMSLayer[] = dataJSON.elements[0].elements
          .find((x) => x.name === 'Capability').elements
          .find((x) => x.name === 'Layer').elements
          .filter((x) => x.name === 'Layer')
          .map((x) => ({
            name: x.elements.find((o) => o.name === 'Name').elements[0].text,
            title: x.elements.find((o) => o.name === 'Title').elements[0].text,
            abstract: x.elements.find((o) => o.name === 'Abstract').elements[0].text,
            endpoint,
          }));

        return layers;
      });
  }
}
