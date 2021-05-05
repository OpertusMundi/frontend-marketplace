import Api from '@/service/api';

import { AxiosResponse } from 'axios';

import { AxiosServerResponse, ServerResponse } from '@/model/response';

import {
  NutsRegionFeatureCollection, NutsRegionFeature, NutsRegionProperties,
} from '@/model/spatial';

export default class SpatialApi extends Api {
  constructor() {
    super({ withCredentials: true });
  }

  /**
   * Get a region with the specified code
   */
  public async findOneByCode(code: string): Promise<ServerResponse<NutsRegionFeature>> {
    const url = `/action/spatial/nuts/${code}`;

    return this.get<ServerResponse<NutsRegionFeature>>(url)
      .then((response: AxiosServerResponse<NutsRegionFeature>) => {
        const { data } = response;

        return data;
      });
  }

  /**
   * Get a list of regions for the specified codes
   */
  public async findAllByCode(codes: string[]): Promise<ServerResponse<NutsRegionFeatureCollection>> {
    const url = `/action/spatial/nuts?code=${codes.join(',')}`;

    return this.get<ServerResponse<NutsRegionFeatureCollection>>(url)
      .then((response: AxiosServerResponse<NutsRegionFeatureCollection>) => {
        const { data } = response;

        return data;
      });
  }

  /**
   * Search regions by name and level
   */
  public async findAllByName(level: number, query: string): Promise<ServerResponse<NutsRegionProperties[]>> {
    const url = `/action/spatial/nuts/${level}/auto-complete?query=${query}`;

    return this.get<ServerResponse<NutsRegionProperties[]>>(url)
      .then((response: AxiosServerResponse<NutsRegionProperties[]>) => {
        const { data } = response;

        return data;
      });
  }

  /**
   * Get all regions by NUTS code prefix.
   *
   * The region for the prefix exact match is not returned.
   *
   * @param prefix The prefix to search for
   * @param maxLevel The max level (inclusive) of the NUTS regions in the result. If not set, all regions are returned
   * @returns 
   */
  public async findAllByPrefix(prefix: string, maxLevel: number | null = null): Promise<ServerResponse<NutsRegionFeatureCollection>> {
    const url = `/action/spatial/nuts/prefix/${prefix}?maxLevel=${maxLevel === null ? '' : maxLevel}`;

    return this.get<ServerResponse<NutsRegionFeatureCollection>>(url)
      .then((response: AxiosServerResponse<NutsRegionFeatureCollection>) => {
        const { data } = response;

        return data;
      });
  }

  /**
   * NUTS region pseudo-WFS. This method is implemented only for testing.
   *
   * When used in a library such as OpenLayers, a url may be used e.g.
   * `/action/spatial/nuts/2/wfs`
   *
   * @param level NUTS level
   * @param bbox bounding box [minX, minY, maxX, maxY] in EPSG:4326 e.g. [-180, -90, 180, 90]
   * @returns
   */
  public async wfs(level: number, bbox: [number, number, number, number]): Promise<NutsRegionFeatureCollection> {
    const url = `/action/spatial/nuts/${level}/wfs?bbox=${bbox.join(',')}`;

    return this.get<NutsRegionFeatureCollection>(url)
      .then((response: AxiosResponse<NutsRegionFeatureCollection>) => {
        const { data } = response;

        return data;
      });
  }
}
