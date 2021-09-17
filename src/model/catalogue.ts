import { Order, PageRequest, QueryResultPage } from '@/model/request';
import { ServerResponse } from '@/model/response';
import { EnumAssetType, EnumSpatialDataServiceType } from '@/model/enum';
import { Provider } from '@/model/account';
import { BasePricingModelCommand, EffectivePricingModel } from '@/model/pricing-model';
import { Resource, AssetFileAdditionalResource, AssetUriAdditionalResource } from '@/model/asset';

export enum EnumConformity {
  CONFORMANT = 'CONFORMANT',
  NOT_CONFORMANT = 'NOT_CONFORMANT',
  NOT_EVALUATED = 'NOT_EVALUATED',
}

export enum EnumTopicCategory {
  BIOTA = 'BIOTA',
  BOUNDARIES = 'BOUNDARIES',
  CLIMA = 'CLIMA',
  ECONOMY = 'ECONOMY',
  ELEVATION = 'ELEVATION',
  ENVIRONMENT = 'ENVIRONMENT',
  FARMING = 'FARMING',
  GEO_SCIENTIFIC = 'GEO_SCIENTIFIC',
  HEALTH = 'HEALTH',
  IMAGERY = 'IMAGERY',
  INLAND_WATERS = 'INLAND_WATERS',
  INTELLIGENCE_MILITARY = 'INTELLIGENCE_MILITARY',
  LOCATION = 'LOCATION',
  OCEANS = 'OCEANS',
  PLANNING_CADASTRE = 'PLANNING_CADASTRE',
  SOCIETY = 'SOCIETY',
  STRUCTURE = 'STRUCTURE',
  TRANSPORTATION = 'TRANSPORTATION',
  UTILITIES_COMMUNICATION = 'UTILITIES_COMMUNICATION',
}

export enum EnumDeliveryMethod {
  NONE = 'NONE',
  DIGITAL_PLATFORM = 'DIGITAL_PLATFORM',
  DIGITAL_PROVIDER = 'DIGITAL_PROVIDER',
  PHYSICAL_PROVIDER = 'PHYSICAL_PROVIDER',
}

export enum EnumElasticSearchSortField {
  TITLE = 'TITLE',
  REVISION_DATE = 'REVISION_DATE',
  SCORE = 'SCORE',
}

export enum EnumDatasetSize {
  SMALL = 'SMALL',
  MEDIUM = 'MEDIUM',
  LARGE = 'LARGE',
}

export enum EnumSpatialOperation {
  INTERSECTS = 'INTERSECTS',
  WITHIN = 'WITHIN',
  CONTAINS = 'CONTAINS',
}

export interface CatalogueQuery extends PageRequest {
  /*
   * Query string used for full text search operation
   */
  query: string;
}

export interface ElasticCatalogueQuery {
  /**
   * Full text search
   */
  text: string;
  /**
   * The nature or genre of the resource
   */
  type: EnumAssetType[];
  /**
   * The type of the spatial data service. This filter selects only assets of type `SERVICE`
   */
  serviceType: EnumSpatialDataServiceType[];
  /**
   * The file format, physical medium, or dimensions of the resource e.g. ESRI Shapefile
   */
  format: string[];
  /**
   * Information about the reference system in automated metadata
   */
  crs: string[];
  /**
   * Minimum price (excluding VAT)
   */
  minPrice: number;
  /**
   * Maximum price (excluding VAT)
   */
  maxPrice: number;
  /**
   * Used for declaring free datasets
   */
  freeDataset: boolean | null;
  /**
   * The temporal extent of the resource (start date) with YYYY-MM-DD format e.g. 2020-06-01
   */
  fromDate: string;
  /**
   * The temporal extent of the resource (end date) with YYYY-MM-DD format e.g. 2020-06-30
   */
  toDate: string;
  /**
   * A high-level classification scheme to assist in the grouping and topic-based
   * search of available spatial data resources
   */
  topic: EnumTopicCategory[];
  /**
   * Minimum scale value
   */
  minScale: number;
  /**
   * Maximum scale value
   */
  maxScale: number;
  /**
   * Distinct scale values
   */
  scales: number[];
  /**
   * Used for declaring open datasets
   */
  openDataset: boolean | null;
  /**
   * Automated metadata attributes
   */
  attribute: string[];
  /**
   * Information about resource licensing
   */
  license: string[];
  /**
   * Name of an entity responsible for making the resource available
   */
  publisher: string[];
  /**
   * Sorting field
   */
  orderBy: EnumElasticSearchSortField;
  /**
   * Sorting direction
   */
  order: Order;
  /**
   * Pagination page index (default: 0)
   */
  page: number;
  /**
   * Pagination page size (default: 10)
   */
  size: number;
  /**
   * Bounding box top left longitude
   */
  topLeftX: number;
  /**
   * Bounding box top left latitude
   */
  topLeftY: number;
  /**
   * Bounding box bottom right longitude
   */
  bottomRightX: number;
  /**
   * Bounding box bottom right latitude
   */
  bottomRightY: number;
  /**
   * Mode of coverage search
   */
  spatialOperation?: EnumSpatialOperation;
  /**
   * Language of asset (ISO 639-1 two-letter codes)
   */
  language: string[];
  /**
   * Size of dataset
   */
  sizeOfDataset: EnumDatasetSize[];
}

interface Keyword {
  /**
   * Keyword value
   */
  keyword: string;
  /**
   * A related theme
   */
  theme: string;
}

interface Scale {
  /**
   * Scale value
   */
  scale: number;
  /**
   * A short description
   */
  description: string;
}

enum EnumResponsiblePartyRole {
  PUBLISHER = 'PUBLISHER',
  OWNER = 'OWNER',
  CUSTODIAN = 'CUSTODIAN',
  USER = 'USER',
  DISTRIBUTOR = 'DISTRIBUTOR',
  ORIGINATOR = 'ORIGINATOR',
  POINT_OF_CONTACT = 'POINT_OF_CONTACT',
  PROCESSOR = 'PROCESSOR',
  AUTHOR = 'AUTHOR',
}

interface ResponsibleParty {
  /**
   * Address of entity responsible for making the resource available
   */
  address: string;
  /**
   * Email of entity responsible for making the resource available
   */
  email: string;
  /**
   * Name of person responsible for making the resource available
   */
  name: string;
  /**
   * Name of entity responsible for making the resource available
   */
  organizationName: string;
  /**
   * Phone of entity responsible for making the resource available
   */
  phone: string;
  /**
   * Role of entity responsible for making the resource available
   */
  role: EnumResponsiblePartyRole
  /**
   * Contact hours of entity responsible for making the resource available
   */
  serviceHours: string;
}

interface BaseCatalogueItem {
  /*
   * An abstract of the resource
   */
  abstract: string;
  /*
   * Degree of conformity with the implementing rules/standard of the metadata followed
   */
  conformity: EnumConformity;
  /**
   * A point or period of time associated with the creation event in the lifecycle of the resource
   */
  creationDate: string;
  /*
   * The temporal extent of the resource (end date)
   */
  dateEnd: string;
  /*
   * The temporal extent of the resource (start date)
   */
  dateStart: string;
  /*
   * Channel of asset distribution
   */
  deliveryMethod: EnumDeliveryMethod;
  /*
   * The file format, physical medium, or dimensions of the resource
   */
  format: string;
  /*
   * Geometry as GeoJSON
   */
  geometry: GeoJSON.Polygon;
  /*
   * The topic of the resource
   */
  keywords: Keyword[];
  /*
   * A language of the resource as an ISO 639-1 two-letter code
   *
   * See: https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes
   */
  language: string;
  /*
   * Information about resource licensing
   */
  license: string;
  /*
   * General explanation of the data producer's knowledge about the lineage of a dataset
   */
  lineage: string;
  /*
   * The date which specifies when the metadata record was created or updated
   */
  metadataDate: string;
  /*
   * The language in which the metadata elements are expressed as a ISO 639-1 two-letter code
   *
   * See: https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes
   */
  metadataLanguage: string;
  /*
   * The email of the organization responsible for the creation and maintenance of the metadata
   */
  metadataPointOfContactEmail: string;
  /*
   * The name of the organization responsible for the creation and maintenance of the metadata
   */
  metadataPointOfContactName: string;
  /**
   * Used for declaring open datasets
   */
  openDataset: boolean;
  /*
   * Provides the ID of a parent dataset
   */
  parentId: string;
  /*
   * Information on the limitations and the reasons for them
   */
  publicAccessLimitations: string;
  /*
   * A point or period of time associated with the publication even in the
   * lifecycle of the resource
   */
  publicationDate: string;
  /*
   * Email of an entity responsible for making the resource available
   */
  publisherEmail: string;
  /*
   * Name of an entity responsible for making the resource available
   */
  publisherName: string;
  /*
   * Information about the reference system
   */
  referenceSystem: string;
  /*
   * The 'navigation section' of a metadata record which point users to the location (URL)
   * where the data can be downloaded, or to where additional information about the resource
   * may be provided
   */
  resourceLocator: string;
  /**
   * The responsible party (including contact information) of the resource
   */
  responsibleParty: ResponsibleParty[] | null;
  /*
   * A point or period of time associated with the revision event in the lifecycle of the resource",
   */
  revisionDate: string;
  /*
   * Denominator of the scale of the data set
   */
  scales: Scale[];
  /**
   * The operations supported by the service
   */
  spatialDataServiceOperations: string[] | null;
  /**
   * The queryables supported by the service
   */
  spatialDataServiceQueryables: string[] | null;
  /*
   * The nature or genre of the service
   */
  spatialDataServiceType: EnumSpatialDataServiceType | null;
  /**
   * The version of the implemented service specification
   */
  spatialDataServiceVersion: string | null;
  /*
   * Spatial resolution refers to the level of detail of the data set
   */
  spatialResolution: number | null;
  /**
   * A description of geospatial analysis or processing that the dataset is suitable for
   */
  suitableFor: string[];
  /*
   * A name given to the resource
   */
  title: string;
  /*
   * A high-level classification scheme to assist in the grouping and topic-based
   * search of available spatial data resources
   */
  topicCategory: EnumTopicCategory[];
  /*
   * The nature or genre of the resource
   */
  type: EnumAssetType | null;
  /**
   * True if the asset must be only used for Value-Added-Services (VAS)
   */
  userOnlyForVas: boolean;
  /*
   * Version of the resource
   */
  version: string;
}

export interface CatalogueItemStatistics {
  /*
   * Total number of downloads
   */
  downloads: number;
  /*
   * Total number of orders
   */
  sales: number;
  /*
   * Average rating. If no user ratings exist, null is returned
   */
  rating: number | null;
}

export interface Metadata {
  /**
   * resource unique identifier
   */
  key: string;
  assetType: 'NetCDF' | 'vector' | 'raster';
}

export type Sample = { [prop: string]: (string | number)[] };

export interface VectorMetadata extends Metadata {
  /**
   * A list with the names of all attributes of the dataset.
   */
  attributes: string[];
  /**
   * A GeoJSON containing the clustered geometries.
   */
  clusters: GeoJSON.FeatureCollection;
  /**
   * A link to a PNG static map with the clustered geometries.
   */
  clustersStatic: string;
  /**
   * The Well-Known-Text representation of the Convex Hull for all geometries.
   */
  convexHull: string;
  /**
   * A link to a PNG static map showing the convex hull.
   */
  convexHullStatic: string;
  /**
   * Count not null values for each attribute in the dataset. The key is the attribute name.
   */
  count: { [attribute: string]: number };
  /**
   * The short name of the dataset's native Coordinate Reference System (CRS).
   */
  crs: string;
  /**
   * The data types for each of the dataset's attributes. The key is the attribute name.
   */
  datatypes: { [attribute: string]: string };
  /**
   * The distinct values for each of the categorical attributes in the dataset. The key is the attribute name.
   */
  distinct: { [attribute: string]: string[] };
  /**
   * The distribution of the values for each categorical attribute in the dataset.
   * The first key is the attribute name.
   * The inner object is the frequency of each value for the specific attribute.
   * The second key is the value.
   */
  distribution: { [attribute: string]: { [value: string]: number } }
  /**
   * The number of features in the dataset.
   */
  featureCount: number;
  /**
   * A link to a GeoJSON with a heatmap of the geometries.
   */
  heatmap: string;
  /**
   * A link to a PNG static map with a heatmap of the geometries.
   */
  heatmapStatic: string;
  /**
   * The Well-Known-Text representation of the Minimum Bounding Rectangle (MBR).
   */
  mbr: string;
  /**
   * A link to a PNG static map with the MBR.
   */
  mbrStatic: string;
  /**
   * The 5, 25, 50, 75, 95 quantiles for each of the numeric attributes in the dataset.
   */
  quantiles: { [q: string]: { [attribute: string]: number } };
  /**
   * The most frequent values for each of the attributes in the dataset.
   */
  recurring: { [attribute: string]: (string | number)[] };
  /**
   * A link to a collection of samples
   */
  samples: string;
  /**
   * Descriptive statistics (min, max, mean, median, std, sum) for the numerical attributes in the dataset.
   */
  statistics: {
    /**
     * The maximum value for each of the numeric attributes. The key is the attribute name.
     */
    max: { [attribute: string]: number };
    /**
     * The mean value for each of the numeric attributes. The key is the attribute name.
     */
    mean: { [attribute: string]: number };
    /**
     * The median value for each of the numeric attributes. The key is the attribute name.
     */
    median: { [attribute: string]: number };
    /**
     * The min value for each of the numeric attributes. The key is the attribute name.
     */
    min: { [attribute: string]: number };
    /**
     * The standard deviation for each of the numeric attributes. The key is the attribute name.
     */
    std: { [attribute: string]: number };
    /**
     * The sum of of all values for each of the numeric attributes. The key is the attribute name.
     */
    sum: { [attribute: string]: number };
  };
  /**
   * A link to a PNG thumbnail of the dataset.
   */
  thumbnail: string;
}

export interface RasterMetadata extends Metadata {
  /**
   * In case the raster is GeoTiff, whether it is Cloud-Optimized or not.
   */
  cog: boolean;
  /**
   * The Color Interpretation for each band.
   */
  colorInterpretation: string[];
  /**
   * The short name of the dataset's native Coordinate Reference System (CRS).
   */
  crs: string;
  /**
   * The data type of each band.
   */
  datatypes: string[];
  /**
   * The default histogram of the raster for each band.
   * Each array contains the following values:
   * - The minimum Pixel Value.
   * - The maximum Pixel Value.
   * - The total number of pixel values.
   * - An array with the frequencies for each Pixel Value (has length equal to the total number of Pixel Values).
   */
  histogram: [number, number, number, number[]][];
  /**
   * General information about the raster file.
   */
  info: {
    /**
     * A list with the bands included in the raster.
     */
    bands: string[];
    /**
     * The driver used to open the raster.
     */
    driver: string;
    /**
     * A list of the files associated with the raster.
     */
    files: string[];
    /**
     * The height in pixels.
     */
    height: number;
    /**
     * Various values describing the image structure. The keys depend on the raster.
     */
    imageStructure: { [key: string]: string | number };
    /**
     * Metadata of the the raster as written in the file. The keys are free-text.
     */
    metadata: { [key: string]: string };
    /**
     * The width in pixels.
     */
    width: number;
  };
  /**
   * The Well-Known-Text representation of the Minimum Bounding Rectangle (MBR).
   */
  mbr: string;
  /**
   * A link to a PNG static map with the MBR.
   */
  mbrStatic: string;
  /**
   * The no-data value of each band.
   */
  noDataValue: { [band: string]: number };
  /**
   * The number of bands in the raster.
   */
  numberOfBands: number;
  /**
   * The resolution for each axis, and the unit of measurement.
   */
  resolution: {
    /**
     * The unit of resolution.
     */
    unit: string;
    /**
     * Resolution in x-axis.
     */
    x: number;
    /**
     * Resolution in y-axis.
     */
    y: number;
  };
  /**
   * A list with descriptive statistics for each band of the raster file.
   */
  statistics: {
    [band: string]: {
      /**
       * The maximum value in the band.
       */
      max: number;
      /**
       * The mean value in the band.
       */
      mean: number;
      /**
       * The minimum value in the band.
       */
      min: number;
      /**
       * The standard deviation in the band.
       */
      std: number;
    }
  };
}

export interface NetCdfMetadata extends Metadata {
  /**
   * A list with the dimensions.
   */
  dimensionsList: string[];
  /**
   * The properties of each dimension. The key is the dimension.
   */
  dimensionsProperties: { [d: string]: { [property: string]: string | number } };
  /**
   * The number of the dimensions.
   */
  dimensionsSize: number;
  /**
   * The Well-Known-Text representation of the Minimum Bounding Rectangle (MBR).
   */
  mbr: string;
  /**
   * A link to a PNG static map with the MBR.
   */
  mbrStatic: string;
  /**
   * The metadata object as written in the file. The key is a free field for the
   * data provider, usually describing the given information.
   */
  metadata: { [m: string]: string };
  /**
   * The no-data value for each the variables. The key is the variable.
   */
  noDataValues: { [v: string]: number };
  /**
   * Descriptive statistics for each of the variables. The key is the variable.
   */
  statistics: {
    [v: string]: {
      /**
       * Whether the data are contiguous or not.
       */
      contiguous: boolean;
      /**
       * The number of values for the specific variable.
       */
      count: number;
      /**
       * The maximum value of the specific variable.
       */
      max: number;
      /**
       * The mean value of the specific variable.
       */
      mean: number;
      /**
       * The minimum value of the specific variable.
       */
      min: number;
      /**
       * The number of missing values for the specific variable.
       */
      missing: number;
      /**
       * The standard deviation for the specific variable.
       */
      std: number;
      /**
       * The variance of the specific variable.
       */
      variance: number;
      /**
       * A free-text string representing the temporal extend of the dataset.
       */
      temporalExtent: string;
      /**
       * A list with the variables.
       */
      variablesList: string[];
      /**
       * The properties for each variable. The key is the variable.
       */
      variablesProperties: { [v: string]: { [property: string]: string | number } };
      /**
       * Number of variables.
       */
      variablesSize: number;
    }
  };

}

export interface ResourceIngestionData {
  /**
   * The resource unique identifier
   */
  key: string;
  /**
   * The number of features stored in the table
   */
  features: number;
  /**
   * The database schema of the created table
   */
  schema: string;
  /**
   * The name of the created table. The table name is equal to the resource unique identifier
   */
  tableName: string;
  /**
   * Service endpoints. Only visible to asset owners
   */
  endpoints?: {
    /**
     * Service type
     */
    type: EnumSpatialDataServiceType,
    /**
     * Service endpoint URI
     */
    uri: string;
  }[]
}

export interface CatalogueItem extends BaseCatalogueItem {
  /*
   * Catalogue item identifier (UUID)
   */
  id: string;
  /*
   * Pricing model available for the asset
   */
  pricingModels: EffectivePricingModel[];
  /*
   * Publisher details
   */
  publisher?: Provider;
  /*
   * Id of an entity responsible for making the resource available
   */
  publisherId: string;
}

export enum EnumContractIcon {
  AlterationNotPermitted = 'AlterationNotPermitted',
  AlterationPermitted = 'AlterationPermitted',
  CommercialUseNotPermitted = 'CommercialUseNotPermitted',
  CommercialUsePermitted = 'CommercialUsePermitted',
  DeliveredByTopio = 'DeliveredByTopio',
  DeliveredByVendor = 'DeliveredByVendor',
  DigitalDelivery = 'DigitalDelivery',
  PhysicalDelivery = 'PhysicalDelivery',
  ThirdPartyNotPermitted = 'ThirdPartyNotPermitted',
  ThirdPartyPermitted = 'ThirdPartyPermitted',
  UpdatesNotIncluded = 'UpdatesNotIncluded',
  UpdatesIncluded = 'UpdatesIncluded',
  WarrantyNotProvided = 'WarrantyNotProvided',
  WarrantyProvided = 'WarrantyProvided',
  NoRestrictionsWorldwide = 'NoRestrictionsWorldwide',
  Geomarketing = 'Geomarketing',
}

export enum EnumContractIconCategory {
  Terms = 'Terms',
  Countries = 'Countries',
  Restrictions = 'Restrictions',
}

export interface ContractTerm {
  /**
   * Icon
   */
  icon: EnumContractIcon;
  /**
   * Icon category
   */
  category: EnumContractIconCategory;
  /**
   * Base64 encoded icon SVG image. Rendered as a data URL e.g.
   * data:image/svg+xml;base64,<image>
   */
  image: string;
  /**
   * "Description of the icon
   */
  description: string;
}

export interface Contract {
  /**
   * Unique key
   */
  key: string;
  /**
   * Title
   */
  title: string;
  /**
   * Version
   */
  version: string;
  /**
   * License terms
   */
  terms: ContractTerm[];
}

export interface CatalogueItemDetails extends CatalogueItem {
  /**
   * Auxiliary files or additional resources to the dataset
   */
  additionalResources: (AssetFileAdditionalResource | AssetUriAdditionalResource)[];
  /**
   * Automated metadata. The property is present only for authenticated users.
   * The array contains an element for each resource. The resource can be found
   * using the key property.
   */
  automatedMetadata?: Metadata[];
  /**
   * Contract details
   */
  contract: Contract;
  /**
   * True if the item is already added to the user's favorite list
   */
  favorite: boolean;
  /**
   * Ingestion information. Only visible to the owners (publishers) of the asset.
   * The array contains an element for each ingested resource. The resource can
   * be found using the key property.
   */
  ingestionInfo?: ResourceIngestionData[];
  /**
   * A list of resources of the dataset
   */
  resources: Resource[];
  /*
   * Asset statistics
   */
  statistics: CatalogueItemStatistics;
  /**
   * A list of all item versions
   */
  versions: string[];
  /**
   * The list of hidden automated metadata properties
   */
  visibility: string[];
}

export interface CatalogueItemCommand extends BaseCatalogueItem {
  /**
   * Auxiliary files or additional resources to the dataset
   */
  additionalResources: (AssetFileAdditionalResource | AssetUriAdditionalResource)[];
  /**
   * Automated metadata. This value will be overwritten by the publish asset workflow
   */
  automatedMetadata?: Metadata[];
  /**
   * True if the resource files should be imported into PostGIS database and published using WMS/WFS
   * endpoints. Ingest operation is only supported for formats of category VECTOR
   */
  ingested: boolean;
  /**
   * Ingestion information. Only visible to the owners (publishers) of the asset.
   * This value will be overwritten by the publish asset workflow
   */
  ingestionInfo?: ResourceIngestionData[];
  /*
   * Pricing model available for the asset
   */
  pricingModels: BasePricingModelCommand[];
  /**
   * A list of resources of the dataset
   */
  resources: Resource[];
  /**
   * Contract template key
   */
  contractTemplateKey: string;
  /**
   * Metadata fields to be hidden by vendor
   */
  visibility?: string[];
}

export enum EnumDraftCommandType {
  ASSET = 'ASSET',
  FILE = 'FILE',
}

export interface DraftApiCommand {
  /**
   * Service type
   */
  serviceType: 'WMS' | 'WFS' | 'DATA_API';
  /**
   * A name given to the resource
   */
  title: string;
  /**
   * Version of the resource
   */
  version: string;
}

export interface DraftApiFromAssetCommand extends DraftApiCommand {
  /**
   * Command type
   */
  type: EnumDraftCommandType.ASSET;
  /**
   * Published asset unique PID
   */
  pid: string;
}

export interface DraftApiFromFileCommand extends DraftApiCommand {
  /**
 * Command type
 */
  type: EnumDraftCommandType.FILE
  /**
   * Path to user's file system
   */
  path: string;
  /**
   * File format
   */
  format: string;
}

export enum EnumCatalogueType {
  OPERTUSMUNDI = 'OPERTUSMUNDI',
  CKAN = 'CKAN',
  CSW = 'CSW',
}

export interface CatalogueHarvestCommand {
  type: EnumCatalogueType | null;
  url: string;
}

export interface CatalogueHarvestImportCommand {
  /**
   * Catalogue URL
   */
  url: string;
  /**
   * Unique identifiers of harvested catalogue items to import
   */
  ids: string[];
}

export type CatalogueQueryResponse = ServerResponse<QueryResultPage<CatalogueItem>>;

export interface CatalogueItemVisibilityCommand {
  /**
   * Resource key
   */
  resourceKey: string;
  /**
   * Controls automated metadata property visibility. Selected properties are hidden.
   */
  visibility: string[];
}

export interface CatalogueItemSamplesCommand {
  /**
   * Resource key
   */
  resourceKey: string;
  /**
   * Sample data
   */
  data: Sample[];
}
