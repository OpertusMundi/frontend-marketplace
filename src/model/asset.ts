import { EnumSpatialDataServiceType } from '@/model/enum';

export enum EnumResourceType {
  FILE = 'FILE',
  SERVICE = 'SERVICE',
}

export enum EnumAssetAdditionalResource {
  FILE = 'FILE',
  URI = 'URI'
}

export enum EnumAssetSourceType {
  NETCDF = 'NETCDF',
  RASTER = 'RASTER',
  VECTOR = 'VECTOR',
}

export interface AssetFileAdditionalResource {
  /**
   * The description of the file
   */
  description: string;
  /**
   * The file name
   */
  fileName: string;
  /**
   * Additional resource file unique identifier
   */
  id: string;
  /**
   * Date of last update in in ISO format
   */
  modifiedOn: string;
  /**
   * The file size
   */
  size: number;
  /**
   * Resource type
   */
  type: EnumAssetAdditionalResource.FILE;
}

export interface AssetFileAdditionalResourceCommand {
  /**
   * File description
   */
  description: string;
  /**
   * File name. If not set, the name of uploaded file is used.
   */
  fileName: string;
}

export interface AssetUriAdditionalResource {
  /**
   * The URI value
   */
  uri: string;
  /**
   * The text displayed for the URI
   */
  text: string;
  /**
   * Resource type
   */
  type: EnumAssetAdditionalResource.URI;
}

export interface Resource {
  /**
   * Resource unique identifier
   */
  id: string;
  /**
   * Resource parent unique identifier
   */
  parentId: string;
}

export interface FileResource extends Resource {
  /**
   * Discriminator field used for deserializing the model to the appropriate data type
   */
  type: EnumResourceType.FILE;
  /**
   * File size in bytes
   */
  size: number;
  /**
   * Asset category computed from the file format
   */
  category: EnumAssetSourceType;
  /**
   * File name
   */
  fileName: string;
  /**
   * Date of last update in ISO format
   */
  modifiedOn: string;
  /**
   * File format
   */
  format: string;
}

interface Attributes {
  cascaded: boolean | null;
  fixedHeight: number | null;
  fixedWidth: number | null;
  noSubsets: boolean | null;
  opaque: boolean | null;
  queryable: boolean | null;
}

interface Dimension {
  defaultValue: string;
  name: string;
  unit: string;
  values: string[];
}

export interface ServiceResource extends Resource {
  /**
   * Discriminator field used for deserializing the model to the appropriate data type
   */
  type: EnumResourceType.SERVICE;
  /**
   * Service type
   */
  serviceType: EnumSpatialDataServiceType;
  /**
   * Service endpoint
   */
  endpoint: string;
  /**
   * Resource Attribute
   */
  attributes: Attributes;
  /**
   * The supported CRS of the resource
   */
  crs: string[];
  /**
   * A list of URLs pointing to the available styles of the resource
   */
  styles: string[];
  /**
   * The bounding box of the resource
   */
  bbox: unknown;
  /**
   * The dimensions of the resource (derived from WMS)
   */
  dimensions: Dimension[];
  /**
   * The output formats of the resource (derived from WMS/WFS/WCS)
   */
  outputFormats: string[];
  /**
   * The filter capabilities of the resource
   */
  filterCapabilities: string[];
  /**
   * The attribution of the resource
   */
  attribution: string;
  /**
   * Resource minimum scale denominator
   */
  minScale:number;
  /**
   * Resource maximum scale denominator
   */
  maxScale:number;
  /**
   * Resource tile sets
   */
  tileSets:unknown[];
}

export interface FileResourceCommand {
  /**
   * File name. If not set, the name of uploaded file is used
   */
  fileName: string;
  /**
   * File format
   */
  format: string;
}
