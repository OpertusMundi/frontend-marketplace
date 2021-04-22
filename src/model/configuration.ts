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

export interface Configuration {
  asset: AssetConfiguration;
  authProviders: EnumAuthProvider[];
  wordPress: WordPressConfiguration;
}
