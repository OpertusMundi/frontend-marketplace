import Api from '@/service/api';

import { AxiosServerResponse, ServerResponse } from '@/model/response';
import { SalesQuery, DataSeries, AssetQuery } from '@/model/analytics';

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
  public async executeSalesQuery(query: SalesQuery): Promise<ServerResponse<DataSeries>> {
    const url = '/action/analytics/sales';

    return this.post<SalesQuery, ServerResponse<DataSeries>>(url, query)
      .then((response: AxiosServerResponse<DataSeries>) => {
        const { data } = response;

        return data;
      });
  }

  public async executeAssetQuery(query: AssetQuery): Promise<ServerResponse<DataSeries>> {
    const url = '/action/analytics/assets';

    return this.post<AssetQuery, ServerResponse<DataSeries>>(url, query)
      .then((response: AxiosServerResponse<DataSeries>) => {
        const { data } = response;

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
}
