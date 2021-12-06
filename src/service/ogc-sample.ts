import Api from '@/service/api';

import { EnumSpatialDataServiceType } from '@/model/enum';
import { WmsLayerSample, WfsLayerSample } from '@/model/catalogue';

export default class SampleApi extends Api {
  constructor() {
    super({ withCredentials: true });
  }

  /**
   * Get WMS layer sample
   *
   * @param draftKey
   * @param resourceKey
   * @param bbox Expected bounding box CRS is EPSG:4326
   * @returns
   */
  public async getWmsSample(
    draftKey: string, resourceKey: string, bbox: [number, number, number, number],
  ): Promise<WmsLayerSample> {
    const url = `/action/drafts/${draftKey}/resources/${resourceKey}/${EnumSpatialDataServiceType.WMS}/samples?bbox=${bbox.join(',')}`;

    const response = await this.get<WmsLayerSample>(url);
    const { data } = response;
    return data;
  }

  /**
   * Get WFS layer sample
   *
   * @param draftKey
   * @param resourceKey
   * @param bbox Expected bounding box CRS is EPSG:4326
   * @returns
   */
  public async getWfsSample(
    draftKey: string, resourceKey: string, bbox: [number, number, number, number],
  ): Promise<WfsLayerSample> {
    const url = `/action/drafts/${draftKey}/resources/${resourceKey}/${EnumSpatialDataServiceType.WFS}/samples?bbox=${bbox.join(',')}`;

    const response = await this.get<WfsLayerSample>(url);
    const { data } = response;
    return data;
  }
}
