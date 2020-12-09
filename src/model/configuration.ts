export enum EnumAuthProvider {
  Forms = 'Forms',
  Google = 'Google',
  GitHub = 'GitHub',
  OpertusMundi = 'OpertusMundi',
}

enum EnumDataProfilerSourceType {
  NETCDF = 'NETCDF',
  RASTER = 'RASTER',
  VECTOR = 'VECTOR',
}

interface AssetFileType {
  /**
   * File extensions allowed in a bundle
   */
  bundleExtensions: string[] | null;
  /**
   * True if multiple files can be uploaded
   */
  bundleSupported: boolean;
  /**
   * File type category
   */
  category: EnumDataProfilerSourceType,
  /**
   * Allowed file extensions
   */
  extensions: string[] | null;
  /**
   * File format
   */
  format: string;
  /**
   * Optional description of the file type
   */
  notes: string;
}

interface AssetConfiguration {
  fileTypes: AssetFileType[];
}

export interface Configuration {
  asset: AssetConfiguration;
  authProviders: EnumAuthProvider[];
}
