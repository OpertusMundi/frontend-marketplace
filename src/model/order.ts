import { EnumPaymentMethod } from '@/model/enum';
import { EnumDeliveryMethod } from '@/model/catalogue';
import { EffectivePricingModel } from '@/model/pricing-model';

export enum EnumOrderItemType {
  ASSET = 'ASSET',
  SERVICE = 'SERVICE',
  BUNDLE = 'BUNDLE',
  VAS = 'VAS',
}

export enum EnumOrderStatus {
  /**
   * Order created
   */
  CREATED = 'CREATED',
  /**
   * PayIn created
   */
  CHARGED = 'CHARGED',
  /**
   * Order payment has been received, asset delivery/subscription registration is pending
   */
  PENDING = 'PENDING',
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

export interface OrderItem {
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

export interface Order {
  /**
   * Order unique key
   */
  key: string;
  /**
   * Order items. Currently only a single item is allowed per order
   */
  items: OrderItem[];
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
