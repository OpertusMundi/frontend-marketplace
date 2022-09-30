import { GeoJSON } from "geojson";
import { ResourceIngestionData } from "./catalogue";
import { PerCallPricingModelCommand } from "./pricing-model";

enum EnumOwnerType {
  OPERTUSMUNDI = 'OPERTUSMUNDI',
  VENDOR = 'VENDOR',
}

enum EnumServiceType {
  WMS = 'WMS',
  WFS = 'WFS',
}

enum EnumStatus {
  PROCESSING = 'PROCESSING',
  FAILED = 'FAILED',
  PUBLISHED = 'PUBLISHED',
  DELETED = 'DELETED',
}

interface Owner {
  key: string,
  type: EnumOwnerType,
  username: string,
}

interface PrivateOGCServiceCommand {
  /**
   * An abstract of the resource
   */
  abstract?: string,
  /**
   * Geometry data CRS
   */
  crs: string,
  /**
   * File encoding
   */
  encoding?: string,
  /**
   * File format
   */
  format: string,
  /**
   * Path to user's file system
   */
  path: string,
  /**
   * Service type
   */
  serviceType: EnumServiceType,
  /**
   * A name given to the resource
   */
  title: string,
  /**
   * The version of the resource
   */
  version: string,
}

interface PrivateOGCService {
  /**
   * An abstract of the resource
   */
  abstractText: string,
  /**
   * 
   */
  automatedMetadata: unknown,
  /**
   * True if the geometry has been set by automated metadata
   */
  computedGeometry: boolean,
  /**
   * Creation date in ISO format
   */
  createdOn: string,
  /**
   * Geometry data CRS
   */
  crs: string,
  /**
   * File encoding
   */
  encoding: string,
  /**
   * Resource file name
   */
  fileName: string,
  /**
   * Resource file size
   */
  fileSize: number,
  /**
   * The file format, physical medium, or dimensions of the resource
   */
  format: string,
  /**
   * Geometry as GeoJSON
   */
  geometry: GeoJSON,
  /**
   * Helpdesk error message
   */
  helpdeskErrorMessage: string,
  /**
   * Ingestion information
   */
  ingestData: ResourceIngestionData,
  /**
   * Service unique identifier. If the service is submitted and a workflow instance is initialized, it is used as the business key
   */
  key: string,
  /**
   * Owner details
   */
  owner: Owner,
  /**
   * Relative path to Topio Drive
   */
  path: string,
  /**
   * Pricing model command
   */
  pricingModel: PerCallPricingModelCommand,
  /**
   * 
   */
  processDefinition: string,
  /**
   * 
   */
  processInstance: string,
  /**
   * Service type
   */
  serviceType: EnumServiceType,
  /**
   * Service status
   */
  status: EnumStatus,
  /**
   * Service title
   */
  title: string,
  /**
   * Date of last update in ISO format
   */
  updatedOn: string,
  /**
   * Service version
   */
  version: string,
}

export {
  EnumStatus,
  EnumServiceType,
  PrivateOGCServiceCommand,
  PrivateOGCService,
};
