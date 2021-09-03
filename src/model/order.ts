import { EnumPaymentMethod } from '@/model/enum';
import { EnumDeliveryMethod } from '@/model/catalogue';
import { EffectivePricingModel } from '@/model/pricing-model';
import { Consumer, Provider } from './account';

export enum EnumOrderItemType {
  ASSET = 'ASSET',
  SERVICE = 'SERVICE',
  BUNDLE = 'BUNDLE',
  VAS = 'VAS',
}

export enum EnumOrderSortField {
  CREATED_ON = 'CREATED_ON',
  MODIFIED_ON = 'MODIFIED_ON',
  REFERENCE_NUMBER = 'REFERENCE_NUMBER',
  STATUS = 'STATUS',
  TOTAL_PRICE = 'TOTAL_PRICE',
}

export enum EnumOrderStatus {
  /**
   * Order created
   */
  CREATED = 'CREATED',
  /**
   * Order created and requires provider approval
   */
  PENDING_PROVIDER_APPROVAL = 'PENDING_PROVIDER_APPROVAL',
  /**
   * Order has been rejected
   */
  PROVIDER_REJECTED = 'PROVIDER_REJECTED',
  /**
   * Order has been accepted
   */
  PROVIDER_ACCEPTED = 'PROVIDER_ACCEPTED',
  /**
   * PayIn created (order previous status must be either CREATED or
   * PROVIDER_ACCEPTED)
   */
  CHARGED = 'CHARGED',
  /**
   * Waiting for provider send confirmation
   */
  PENDING_PROVIDER_SEND_CONFIRMATION = 'PENDING_PROVIDER_SEND_CONFIRMATION',
  /**
   * Waiting for consumer receive confirmation
   */
  PENDING_CONSUMER_RECEIVE_CONFIRMATION = 'PENDING_CONSUMER_RECEIVE_CONFIRMATION',
  /**
   * Order payment has been received and assets have been delivered asset.
   * Asset/subscription registration is pending
   */
  ASSET_REGISTRATION = 'ASSET_REGISTRATION',
  /**
   * Order has been cancelled, not payment received
   */
  CANCELLED = 'CANCELLED',
  /**
   * Order has been cancelled and PayIn has been refunded
   */
  REFUNDED = 'REFUNDED',
  /**
   * Order has been completed
   */
  SUCCEEDED = 'SUCCEEDED',
}

interface OrderItem {
  /**
   * Index of the specific item in the order
   */
  index: number;
  /**
   * Item type
   */
  type: EnumOrderItemType;
  /**
   * Catalogue item unique PID
   */
  item: string;
  /**
   * Item description at the time of the purchase
   */
  description: string;
  /**
   * Pricing model at the time of the purchase
   */
  pricingModel: EffectivePricingModel;
  /**
   * Item total price
   */
  totalPrice: number;
  /**
   * Item price excluding tax
   */
  totalPriceExcludingTax: number;
  /**
   * "Item tax
   */
  totalTax: number;
  /**
   * Optional discount code applied to the item's price
   */
  discountCode: string | null;
}

export interface ConsumerOrderItem extends OrderItem {
  /**
   * Asset provider
   */
  provider: Provider;
}

export interface ProviderOrderItem extends OrderItem {
  /**
   * Asset contract template identifier
   */
  contractTemplateId: number | null;
  /**
   * Asset contract template version
   */
  contractTemplateVersion: string;
}

interface Order {
  /**
   * Order unique key
   */
  key: string;
  /**
   * The total price of all PayIn items (the debited funds of the PayIn)
   */
  totalPrice: number;
  /**
   * The total price of all PayIn items excluding tax
   */
  totalPriceExcludingTax: number;
  /**
   * The total tax for all PayIn items
   */
  totalTax: number
  /**
   * The currency in ISO 4217 format. Only `EUR` is supported
   */
  currency: string;
  /**
   * Order creation date in ISO format e.g. 2020-06-10T16:01:04.991+03:00
   */
  createdOn: string;
  /**
   * Order status
   */
  status: EnumOrderStatus;
  /**
   * Status last update date in ISO format e.g. 2020-06-10T16:01:04.991+03:00
   */
  statusUpdatedOn: string;
  /**
   * Delivery method
   */
  deliveryMethod: EnumDeliveryMethod;
  /**
   * Payment method
   */
  paymentMethod: EnumPaymentMethod;
  /**
   * User friendly reference code for support
   */
  referenceNumber: string;
}

export interface ConsumerOrder extends Order {
  /**
   * Order items. Currently only a single item is allowed per order
   */
  items: ConsumerOrderItem[];
}

export interface ProviderOrder extends Order {
  /**
   * Order consumer customer
   */
  consumer: Consumer;
  /**
   * Order items. Currently only a single item is allowed per order
   */
  items: ProviderOrderItem[];
}
