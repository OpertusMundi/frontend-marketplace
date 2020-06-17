import { PageRequest, QueryResultPage } from '@/model/request';
import { ServerResponse } from '@/model/response';
import { BasePricingModel, BasePricingModelCommand } from '@/model/pricing-model';

export interface CatalogueQuery extends PageRequest {
  /*
   * Query string used for full text search operation
   */
  query: string;
}

interface BaseCatalogueItem {
  /*
   * An abstract of the resource
   */
  abstractText: string;
  /*
   * Auxiliary files or additional resources to the dataset
   */
  additionalResources: string;
  /*
   * Degree of conformity with the implementing rules/standard of the metadata followed
   */
  conformity: string;
  /*
   * Provides information about the datasets that the service operates on
   */
  coupledResource: string;
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
   * The topic of the resource
   */
  keywords: string;
  /*
   * A language of the resource
   */
  language: string;
  /*
   * Information about resource licensing
   */
  license: string;
  /*
   * General explanation of the data producer’s knowledge about the lineage of a dataset
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
   * The ‘navigation section’ of a metadata record which point users to the location (URL)
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
  scale: string;
  /*
   * The nature or genre of the service
   */
  spatialDataServiceType: string;
  /*
   * Spatial resolution refers to the level of detail of the data set
   */
  spatialResolution: string;
  /*
   * A name given to the resource
   */
  title: string;
  /*
   * A high-level classification scheme to assist in the grouping and topic-based
   * search of available spatial data resources
   */
  topicCategory: string;
  /*
   * The nature or genre of the resource
   */
  type: string;
  /*
   * Version of the resource
   */
  version: string;
  /*
   * Geometry as GeoJSON
   */
  geometry: GeoJSON.Polygon;
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
}

export interface CatalogueAddItemCommand extends BaseCatalogueItem {
  /*
   * Pricing model available for the asset
   */
  pricingModels: BasePricingModelCommand[];
}

export type CatalogueQueryResponse = ServerResponse<QueryResultPage<CatalogueItem>>;