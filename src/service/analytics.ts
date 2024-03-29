import Api from '@/service/api';
import { showApiErrorModal } from '@/helper/api-errors';
import { AxiosServerResponse, ServerResponse } from '@/model/response';
import {
  SalesQuery,
  DataSeries,
  AssetQuery,
  CoverageQuery,
  AssetTotalValueQuery,
  PopularAsset,
  PopularTerm,
  SubscribersQuery,
  EarningsAssetTypeQuery,
  GoogleAnalyticsQuery,
  VendorCountQuery,
  BaseQuery,
  EnumAssetSource,
  EnumAssetQueryMetric, PopularAssetCount,
} from '@/model/analytics';
import { AxiosResponse } from 'axios';

export default class AnalyticsApi extends Api {
  constructor() {
    super({ withCredentials: true });
  }

  /**
   * Executes a query on sales data and returns a single data series.
   *
   * Role ROLE_PROVIDER is required.
   *
   * @param query Query to execute
   * @returns
   *
   * @example
   * executeSalesQuery({
   *   "time": {
   *     "unit": "WEEK",
   *     "min": "2021-01-01",
   *     "max": "2021-12-31"
   *   },
   *   "areas": {
   *     "enabled": true
   *   },
   *   "metric": "COUNT_TRANSACTIONS"
   * });
   *
   * // Returns data grouped by date and area. Date instances will
   * // contain only year and week properties.
   *
   * {
   *   "messages": [],
   *   "result": {
   *     "timeUnit": "WEEK",
   *     "points": [{
   *       "time": {
   *         "year": 2021,
   *         "month": 5,
   *         "week": 21
   *       },
   *       "location": {
   *         "code": "GR",
   *         "lon": null,
   *         "lat": null
   *       },
   *       "value": 2
   *     }]
   *   },
   *   "success": true
   * }
   */
  public async executeSalesQuery(query: SalesQuery | AssetQuery): Promise<ServerResponse<DataSeries>> {
    const url = '/action/analytics/sales';

    return this.post<SalesQuery | AssetQuery, ServerResponse<DataSeries>>(url, query)
      .then((response: AxiosServerResponse<DataSeries>) => {
        const { data } = response;
        if (data.success === false) showApiErrorModal(data.messages);

        return data;
      });
  }

  public async executeAssetQuery(query: AssetQuery): Promise<ServerResponse<DataSeries>> {
    const url = '/action/analytics/assets';

    return this.post<AssetQuery, ServerResponse<DataSeries>>(url, query)
      .then((response: AxiosServerResponse<DataSeries>) => {
        const { data } = response;
        if (data.success === false) showApiErrorModal(data.messages);

        return data;
      });
  }

  public async executeCoverageQuery(query: CoverageQuery): Promise<ServerResponse<DataSeries>> {
    const url = '/action/analytics/coverage';

    return this.post<CoverageQuery, ServerResponse<DataSeries>>(url, query)
      .then((response: AxiosServerResponse<DataSeries>) => {
        const { data } = response;
        if (data.success === false) showApiErrorModal(data.messages);

        return data;
      });
  }

  public async executeTotalAssetValueQuery(query: AssetTotalValueQuery): Promise<ServerResponse<DataSeries>> {
    const url = '/action/analytics/asset-total-value';

    return this.post<AssetTotalValueQuery, ServerResponse<DataSeries>>(url, query)
      .then((response: AxiosServerResponse<DataSeries>) => {
        const { data } = response;
        if (data.success === false) showApiErrorModal(data.messages);

        return data;
      });
  }

  public async getMostPopularAssets(query?: AssetQuery, limit = 10): Promise<ServerResponse<PopularAsset[]>> {
    const url = `/action/analytics/popular-assets?includeAssets=true&limit=${limit}`;

    const queryDefault = { metric: EnumAssetQueryMetric.COUNT, source: EnumAssetSource.VIEW };
    const q: AssetQuery = query ? { ...queryDefault, ...query } : queryDefault;

    return this.post<AssetQuery, ServerResponse<{ asset: PopularAsset }[]>>(url, q)
      .then((response: AxiosServerResponse<{ asset: PopularAsset }[]>) => {
        const { data } = response;
        if (data.success === false) showApiErrorModal(data.messages);

        return { ...data, result: data.result.map((x) => x.asset) };
      });
  }

  public async getPopularAssetCounts(query?: AssetQuery, limit = 10): Promise<ServerResponse<PopularAssetCount[]>> {
    const url = `/action/analytics/popular-assets?includeAssets=true&limit=${limit}`;
    return this.post<AssetQuery, ServerResponse<PopularAssetCount[]>>(url, query)
      .then((response: AxiosServerResponse<PopularAssetCount[]>) => {
        const { data } = response;
        if (data.success === false) showApiErrorModal(data.messages);
        return data;
      });
  }

  public async getMostPopularTerms(query?: BaseQuery | null): Promise<ServerResponse<PopularTerm[]>> {
    const url = '/action/analytics/popular-terms';

    const queryData = query ? { source: 'SEARCH', metric: 'COUNT_VIEWS', ...query } : { source: 'SEARCH', metric: 'COUNT_VIEWS' };

    return this.post<BaseQuery, ServerResponse<PopularTerm[]>>(url, queryData)
      .then((response: AxiosServerResponse<PopularTerm[]>) => {
        const { data } = response;
        if (data.success === false) showApiErrorModal(data.messages);

        return data;
      });
  }

  public async executeSubscribersQuery(query: SubscribersQuery): Promise<ServerResponse<DataSeries>> {
    const url = '/action/analytics/subscribers';

    return this.post<SubscribersQuery, ServerResponse<DataSeries>>(url, query)
      .then((response: AxiosResponse<ServerResponse<DataSeries>>) => {
        const { data } = response;
        if (data.success === false) showApiErrorModal(data.messages);

        return data;
      });
  }

  public async executeEarningsAssetTypeQuery(query: EarningsAssetTypeQuery): Promise<ServerResponse<DataSeries>> {
    const url = '/action/analytics/earnings-asset-type';

    return this.post<EarningsAssetTypeQuery, ServerResponse<DataSeries>>(url, query)
      .then((response: AxiosResponse<ServerResponse<DataSeries>>) => {
        const { data } = response;
        if (data.success === false) showApiErrorModal(data.messages);

        return data;
      });
  }

  public async executeGoogleAnalyticsQuery(query: GoogleAnalyticsQuery): Promise<ServerResponse<DataSeries>> {
    const url = '/action/analytics/google-analytics';

    return this.post<GoogleAnalyticsQuery, ServerResponse<DataSeries>>(url, query)
      .then((response: AxiosResponse<ServerResponse<DataSeries>>) => {
        const { data } = response;
        if (data.success === false) showApiErrorModal(data.messages);

        return data;
      });
  }

  public async executeVendorCountQuery(query: VendorCountQuery): Promise<ServerResponse<DataSeries>> {
    const url = '/action/analytics/vendor-count';

    return this.post<VendorCountQuery, ServerResponse<DataSeries>>(url, query)
      .then((response: AxiosResponse<ServerResponse<DataSeries>>) => {
        const { data } = response;
        if (data.success === false) showApiErrorModal(data.messages);

        return data;
      });
  }

  /**
   * Helper method for converting a data series to a feature collection
   * @param data
   * @returns
   */
  public toFeatureCollections(data: DataSeries): GeoJSON.FeatureCollection<GeoJSON.Point, { label: string, value: number }> {
    const result: GeoJSON.FeatureCollection<GeoJSON.Point, { label: string, value: number }> = {
      type: 'FeatureCollection',
      features: [],
    };
    /* eslint-disable no-unused-expressions */
    data?.points.forEach((p, index) => {
      if (p.location?.lon && p.location?.lat && p.location?.code) {
        result.features.push({
          id: index,
          type: 'Feature',
          geometry: {
            type: 'Point',
            coordinates: [p.location.lon, p.location.lat],
          },
          properties: {
            label: p.location?.code,
            value: p.value,
          },
        });
      }
    });

    return result;
  }

  public executeAssetCountQuery(query: AssetTotalValueQuery): Promise<ServerResponse<DataSeries>> {
    const endPoint = '/action/analytics/asset-count';

    return this.post<AssetTotalValueQuery, ServerResponse<DataSeries>>(endPoint, query)
      .then((response: AxiosResponse<ServerResponse<DataSeries>>) => {
        const { data } = response;
        if (data.success === false) showApiErrorModal(data.messages);

        return data;
      });
  }
}
