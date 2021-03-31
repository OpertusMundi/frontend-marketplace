export enum EnumResourceType {
  FILE = 'FILE',
  SERVICE = 'SERVICE',
}

export enum EnumAssetSourceType {
  NETCDF = 'NETCDF',
  RASTER = 'RASTER',
  VECTOR = 'VECTOR',
}

export enum EnumServiceResourceType {
  WFS = 'WFS',
  WMS = 'WMS',
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
}

export interface Resource {
  /**
   * Resource unique identifier
   */
  id: string;
  /**
   * Parent resource unique identifier
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

export interface ServiceResource extends Resource {
  /**
   * Discriminator field used for deserializing the model to the appropriate data type
   */
  type: EnumResourceType.SERVICE;
  /**
   * Service type
   */
  serviceType: EnumServiceResourceType;
  /**
   * Service endpoint
   */
  endpoint: string;
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
