import { EnumAssetSourceType } from '@/model/asset';
import { PricingModelSettings } from '@/model/pricing-model';

export enum EnumAuthProvider {
  Forms = 'Forms',
  Google = 'Google',
  GitHub = 'GitHub',
  OpertusMundi = 'OpertusMundi',
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
  category: EnumAssetSourceType,
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
  pricingModels: PricingModelSettings[];
}

interface WordPressConfiguration {
  endpoint: string;
}

interface Country {
  /**
   * The country ISO 3166-1 alpha-2 code
   */
  code: string;
  name: string;
}

interface CountryWithGeometry extends Country {
  /**
   * The bounding box of the country
   */
  geometry: GeoJSON.MultiPolygon;
}

interface Language {
  /**
   * The language ISO 639-1 two-letter code
   */
  code: string;
  name: string;
}

export interface Configuration {
  asset: AssetConfiguration;
  authProviders: EnumAuthProvider[];
  countries: Country[];
  europeCountries: CountryWithGeometry[];
  europeLanguages: Language[];
  wordPress: WordPressConfiguration;
}
