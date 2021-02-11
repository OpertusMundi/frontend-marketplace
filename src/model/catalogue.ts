import { PageRequest, QueryResultPage } from '@/model/request';
import { ServerResponse } from '@/model/response';
import { BasePricingModel, BasePricingModelCommand } from '@/model/pricing-model';
import { AssetResource, AssetFileAdditionalResource, AssetUriAdditionalResource } from '@/model/asset';

export enum EnumConformity {
  CONFORMANT = 'CONFORMANT',
  NOT_CONFORMANT = 'NOT_CONFORMANT',
  NOT_EVALUATED = 'NOT_EVALUATED',
}

export enum EnumSpatialDataServiceType {
  TMS = 'TMS',
  WMS = 'WMS',
  WFS = 'WFS',
  WCS = 'WCS',
  CSW = 'CSW',
  DATA_API = 'DATA_API',
  OGC_API = 'OGC_API',
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

export enum EnumType {
  RASTER = 'RASTER',
  SERVICE = 'SERVICE',
  VECTOR = 'VECTOR',
}

export interface CatalogueQuery extends PageRequest {
  /*
   * Query string used for full text search operation
   */
  query: string;
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
  theme: string;
}

interface BaseCatalogueItem {
  /*
   * An abstract of the resource
   */
  abstract: string;
  /**
   * Automated metadata
   */
  automatedMetadata?: any;
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
   * A language of the resource
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
   * The language in which the metadata elements are expressed
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
  /*
   * A point or period of time associated with the revision event in the lifecycle of the resource",
   */
  revisionDate: string;
  /*
   * Denominator of the scale of the data set
   */
  scales: Scale[];
  /*
   * The nature or genre of the service
   */
  spatialDataServiceType: EnumSpatialDataServiceType | null;
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
  type: EnumType | null;
  /*
   * Version of the resource
   */
  version: string;
}

export interface Publisher {
  /*
   * Company location (city)
   */
  city: string;
  /*
   * Company country
   */
  country: string;
  /**
   * Company contact email. This is the email address from the
   * provider's profile. The email is returned only if it has been
   * verified.
   */
  email: string | null;
  /*
   * Provider registration date in ISO format e.g. 2020-06-10T16:01:04.991+03:00
   */
  joinedAt: string;
  /*
   * Publisher unique id
   */
  id: string;
  /*
   * Base64 encoded company logo image
   */
  logoImage: string;
  /*
   * Company logo image mime type (used with image property to create a data URL)
   */
  logoImageMimeType: string;
  /*
   * Company name
   */
  name: string;
  /*
   * Average rating. If no user ratings exist, null is returned
   */
  rating: number | null;
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

export interface CatalogueItem extends BaseCatalogueItem {
  /*
   * Catalogue item identifier (UUID)
   */
  id: string;
  /*
   * Pricing model available for the asset
   */
  pricingModels: BasePricingModel[];
  /*
   * Publisher details
   */
  publisher?: Publisher;
  /*
   * Id of an entity responsible for making the resource available
   */
  publisherId: string;
}

export interface CatalogueItemDetails extends CatalogueItem {
  /**
   * Auxiliary files or additional resources to the dataset
   */
  additionalResources: (AssetFileAdditionalResource | AssetUriAdditionalResource)[];
  /**
   * A list of resources of the dataset
   */
  resources: AssetResource[];
  /*
   * Asset statistics
   */
  statistics: CatalogueItemStatistics;
  /**
   * A list of all item versions
   */
  versions: string[];
}

export interface CatalogueItemCommand extends BaseCatalogueItem {
  /**
   * Auxiliary files or additional resources to the dataset
   */
  additionalResources: (AssetFileAdditionalResource | AssetUriAdditionalResource)[];
  /**
   * True if the resource files should be imported into PostGIS database and published using WMS/WFS
   * endpoints. Ingest operation is only supported for formats of category VECTOR
   */
  ingested: boolean;
  /*
   * Pricing model available for the asset
   */
  pricingModels: BasePricingModelCommand[];
  /**
   * A list of resources of the dataset
   */
  resources: AssetResource[];

}

export type CatalogueQueryResponse = ServerResponse<QueryResultPage<CatalogueItem>>;
