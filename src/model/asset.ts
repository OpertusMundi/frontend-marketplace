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

export interface AssetResource {
  /**
   * File name
   */
  fileName: string;
  /**
   * File unique identifier
   */
  id: string;
  /**
   * Date of last update in in ISO format
   */
  modifiedOn: string;
  /**
   * File size in bytes
   */
  size: number;
}

export interface AssetResourceCommand {
  /**
   * File name. If not set, the name of uploaded file is used.
   */
  fileName: string;
  /**
   * File format
   */
  format: string;
}
