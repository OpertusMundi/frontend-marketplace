export interface SubscriptionPlan {
  /**
   * Subscription plan unique identifier
   */
  id: string;
  title: string;
  description: string;
  /**
   * Reference to the title of another subscription plan which this plan extends
   */
  parent: string;
  /**
   * Billing options
   */
  billing: {
    /**
     * Price for annual billing
     */
    annually: number;
    /**
     * Price for monthly billing
     */
    monthly: number;
  };
  /**
   * Array of features supported by the plan
   */
  features: string[];
  /**
   * Processing resources limits
   */
  processingUnits: {
    /**
     * Units per month
     */
    month: number;
    /**
     * Units per minute
     */
    minute: number;
  };
  /**
   * Request rate limits
   */
  requests: {
    /**
     * Requests per month
     */
    month: number;
    /**
     * Requests per minute
     */
    minute: number;
  }
  /**
   * Subscription plan license
   */
  license: string;
}

/**
 * Sentinel Hub catalogue API query
 *
 * @see https://docs.sentinel-hub.com/api/latest/reference/#operation/postSearchSTAC
 */
export interface ClientCatalogueQuery {
  /**
   * Only features that have a geometry that intersects the bounding box are selected.
   * The bounding box is provided as four or six numbers, depending on whether the coordinate
   * reference system includes a vertical axis (elevation or depth)
   */
  bbox?: [number, number, number, number, number?, number?];
  /**
   * Interval start date-time. Date and time expressions adhere to RFC 3339
   */
  fromDateTime?: string;
  /**
   * Interval end date-time. Date and time expressions adhere to RFC 3339
   */
  toDateTime?: string;
  /**
   * Spatial search
   */
  intersects?: GeoJSON.Geometry;
  /**
   * Collection identifier to include in the search for items. Only Items in the provided collection will be searched
   */
  collection: string;
  /**
   * Array of Item ids to return. All other filter parameters that further restrict the number of search results are ignored
   */
  ids?: string[];
  /**
   * The maximum number of results to return (page size). Defaults to 10
   */
  limit?: number;
  /**
   * The token to retrieve the next set of results
   */
  next?: number;
  /**
   * Return distinct values of specified property
   */
  distinct?: string;
  /**
   * The include and exclude members specify an array of property names that are either included or excluded from the result,
   * respectively. If both include and exclude are specified, include takes precedence. Values should include the full JSON
   * path of the property.
   */
  fields?: {
    include?: string[];
    exclude?: string[];
  }
  /**
   * Define which properties to query and the operations to apply
   */
  query?: any;
}

interface Link {
  href: string;
  rel: string;
  type: string;
}

interface Asset {
  href: string;
  title: string;
  description: string;
  type: string;
  roles: string[];
}

interface Feature {
  id: string;
  geometry: GeoJSON.Geometry;
  bbox: number[];
  properties: any;
  links: Link[];
  assets: { [name: string]: Asset }
}

interface Context {
  next: number | null;
  limit: number;
  returned: number;
}

export interface SentinelHubCatalogueResponse {
  features: Feature[];
  links: Link[];
  context: Context;
}
