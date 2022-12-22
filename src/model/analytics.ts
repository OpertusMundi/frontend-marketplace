import { EnumTopicCategory } from './catalogue';

export enum EnumTemporalUnit {
  YEAR = 'YEAR',
  MONTH = 'MONTH',
  WEEK = 'WEEK',
  DAY = 'DAY',
}

interface TemporalDimension {
  /**
   * Time interval unit (required)
   */
  unit: EnumTemporalUnit;
  /**
   * Min date in YYYY-MM-DD ISO format
   */
  min?: string;
  /**
   * Max date in YYYY-MM-DD ISO format
   */
  max?: string;
}

interface SpatialDimension {
  /**
   * True if grouping based on country codes must be performed
   */
  enabled: boolean;
  /**
   * Country codes in ISO 3166-1 alpha-2 format. If one or more codes are
   * specified, data will be filtered using the specified codes
   */
  codes?: string[];
}

interface SegmentDimension {
  /**
   * True if grouping based on segment codes must be performed
   */
  enabled: boolean;
  /**
   * If one or more segments are selected, data will be filtered using the
   * specified segments
   */
  segments?: EnumTopicCategory;
}

export interface BaseQuery {
  /**
   * Temporal dimension constraints
   */
  time?: TemporalDimension | null;
  /**
   * Spatial dimension constraints
   */
  areas?: SpatialDimension | null;
  /**
   * Segment dimension constraints
   */
  segments?: SegmentDimension | null;
  /**
   * One or more publishers for grouping data. This option is available only to platform
   * administrators. For providers, the service automatically sets the value to the provider key.
   */
  publishers?: string[] | null;
  /**
   * One or more asset PIDs for grouping data
   */
  assets?: string[] | null;
}

export enum EnumSalesQueryMetric {
  COUNT_TRANSACTIONS = 'COUNT_TRANSACTIONS',
  SUM_SALES = 'SUM_SALES',
  COUNT_VIEWS = 'COUNT_VIEWS'
}

export enum EnumSubscribersQueryMetric {
  COUNT_SUBSCRIBERS = 'COUNT_SUBSCRIBERS',
  COUNT_CALLS = 'COUNT_CALLS',
  EARNINGS = 'EARNINGS',
  SUBSCRIBER_LOCATION = 'SUBSCRIBER_LOCATION',
  SUBSCRIBER_SEGMENT = 'SUBSCRIBER_SEGMENT',
}

export interface SalesQuery extends BaseQuery {
  /**
   * Aggregate to compute
   */
  metric: EnumSalesQueryMetric;
}

export interface SubscribersQuery extends BaseQuery {
  /**
   * Dimension to be filtered
   */
  metric: EnumSubscribersQueryMetric;
}

export interface GoogleAnalyticsQuery extends BaseQuery {
  /**
   * Aggregate to compute
   */
  metric: EnumGoogleAnalyticsMetric;
}

export interface VendorCountQuery {
  time: TemporalDimension;
}

export enum EnumAssetTypeDimension {
  /**
   * Aggregate to compute
   */
  FILE_ASSET = 'FILE_ASSET',
  API = 'API',
  TOTAL = 'TOTAL',
  ALL_ASSET_TYPES = 'ALL_ASSET_TYPES',
}

export enum EnumGoogleAnalyticsMetric {
  /**
   * Aggregate to compute
   */
  COUNT_USERS = 'COUNT_USERS',
  COUNT_SESSIONS = 'COUNT_SESSIONS',
}

export interface EarningsAssetTypeQuery extends SalesQuery {
  dimension: EnumAssetTypeDimension;
}

export enum EnumAssetSource {
  /**
   * Search operation views
   */
  SEARCH = 'SEARCH',
  /**
   * Record views
   */
  VIEW = 'VIEW',
  /**
   * Related assets operation views
   */
  REFERENCE = 'REFERENCE',
}

export enum EnumAssetQueryMetric {
  /**
   * Number of views
   */
  COUNT = 'COUNT_VIEWS',
}

export interface AssetQuery extends BaseQuery {
  /**
   * Source of data
   */
  source: EnumAssetSource;
  /**
   * Aggregate to compute
   */
  metric: EnumAssetQueryMetric
}

export interface AssetTotalValueQuery {
  time?: TemporalDimension | null;
}

export interface CoverageQuery {
  time?: TemporalDimension | null;
  segments?: EnumTopicCategory[] | null;
}

/**
 * An object that represents a time instant. Depending on the time unit specified by a
 * query, properties are set up to the specified time granularity e.g. if time unit is `MONTH`,
 * only properties `year` and `month` will be returned
 */
interface TimeInstant {
  year: number;
  month?: number;
  week?: number;
  day?: number;
}

/**
 * An object that represents a country with its centroid
 */
interface Location {
  /**
   * Country code in ISO 3166-1 alpha-2 format
   */
  code: string;
  lon?: number;
  lat?: number;
}

export interface DataPoint {
  /**
   * The time instant the data point refers to. If no temporal constraint is specified in
   * the query, this property is not set
   */
  time?: TimeInstant;
  /**
   * The location the data point refers to. If no spatial constraint is specified in the
   * query, this property is not set
   */
  location?: Location;
  /**
   * Asset segment
   */
  segment?: string;
  /**
   * The publisher key the data point refers to. If no publisher constraint is specified
   * in the query, this property is not set. If a user is not an administrator, this property
   * is never set
   */
  publisher?: string;
  /**
   * The asset PID the data point refers to. If no asset constraint is specified in the
   * query, this property is not set
   */
  asset?: string;
  /**
   * The value of the data point
   */
  value: number;
}

export interface DataSeries {
  /**
   * Request time unit
   */
  timeUnit?: EnumTemporalUnit;
  /**
   * Data series points
   */
  points: DataPoint[];
}

export interface PopularTerm {
  [key: string]: number;
}

export interface PopularAsset {
  [key: string]: number;
}

export interface PopularAssetCount {
  pid: string,
  count: number
}
