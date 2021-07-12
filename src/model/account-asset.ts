import { Consumer, Provider } from './account';
import { CatalogueItem, EnumTopicCategory } from './catalogue';

export enum EnumConsumerAssetSortField {
  ADDED_ON = 'ADDED_ON',
  PUBLISHER = 'PUBLISHER',
  TITLE = 'TITLE',
  UPDATE_ELIGIBILITY = 'UPDATE_ELIGIBILITY',
}

enum EnumAccountAssetSource {
  PURCHASE = 'PURCHASE',
  UPDATE = 'UPDATE',
}

export interface AccountAsset {
  /**
   * Order unique key
   */
  orderKey: string;
  /**
   * Date of purchase in ISO format
   */
  purchasedOn: string;
  /**
   * Date registered to user account in ISO format
   */
  addedOn: string;
  /**
   * Years of updates
   */
  updateInterval: number;
  /**
   * When is the last date (in ISO format) the user is eligible for receiving updates
   */
  updateEligibility: string;
  /**
   * Operation that registered the subscription
   */
  source: EnumAccountAssetSource;
  /**
   * Catalogue item
   */
  item: CatalogueItem;
}

export interface AccountSubscription {
  /**
   * Service PID
   */
  service: string;
  /**
   * When the subscription was registered to the user account
   */
  addedOn: string;
  /**
   * Date of last update
   */
  updatedOn: string;
  /**
   * Operation that registered the subscription
   */
  source: EnumAccountAssetSource;
  /**
   * First asset topic category if any exist
   */
  segment: EnumTopicCategory;
}

export interface ConsumerAccountSubscription extends AccountSubscription {
  provider: Provider;
}

export interface ProviderAccountSubscription extends AccountSubscription {
  consumer: Consumer;
}