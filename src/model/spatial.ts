export interface NutsRegionProperties {
  /**
   * Region unique code (NUTS identifier)
   */
  code: string;
  /**
   * Region level (NUTS level)
   */
  level: number;
  /**
   * Region name
   */
  name: string;
  /**
   * Region latin name
   */
  nameLatin: string;
  /**
   * Region population
   */
  population: number;
}

export interface Feature<PropsType extends unknown, GeometryType extends GeoJSON.Geometry> {
  /**
   * Feature identifier
   */
  id: string;
  /**
   * Object type
   */
  type: 'Feature';
  /**
   * Geometry as GeoJSON
   */
  geometry: GeometryType;
  /**
   * Feature properties
   */
  properties: PropsType;
}

export interface FeatureCollection<PropsType extends unknown, GeometryType extends GeoJSON.Geometry, FeatureType extends Feature<PropsType, GeometryType>> {
  /**
   * Object type. Always equal to `FeatureCollection`
   */
  type: 'FeatureCollection';
  /**
   * Array of features
   */
  features: FeatureType[];
}

export type NutsRegionFeature = Feature<NutsRegionProperties, GeoJSON.MultiPolygon>;
export type NutsRegionFeatureCollection = FeatureCollection<NutsRegionProperties, GeoJSON.MultiPolygon, NutsRegionFeature>;

export interface EpsgCode {
  code: number;
  name: string;
}
