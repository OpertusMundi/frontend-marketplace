import { CatalogueItem } from '@/model/catalogue';
import { QuotationParameters, EffectivePricingModel } from '@/model/pricing-model';

export interface CartItem {
  /*
   * Cart item unique identifier
   */
  id: string;
  /*
   * Catalogue item. In contrast to catalogue responses, a cart item
   * contains no pricing models. The effective pricing model is stored
   * in property pricingModel
   */
  asset: CatalogueItem;
  /*
   * Date added to the cart
   */
  addedAt: string;
  /*
   * Selected pricing model
   */
  pricingModel: EffectivePricingModel;
}

export interface Cart {
  /*
   * Selected items
   */
  items: CartItem[];
  /*
   * Applied discount coupons (for future use)
   */
  appliedCoupons: string[];
  /*
   * Total price including tax
   */
  totalPrice: number;
  /*
   * Total price excluding tax
   */
  totalPriceExcludingTax: number;
  /*
   * Total tax
   */
  taxTotal: number;
  /*
   * Currency of monetary values (EUR)
   */
  currency: string;
  /*
   * Number of items in the cart
   */
  totalItems: number;
  /*
   * Cart creation date in ISO format e.g. 2020-06-10T16:01:04.991+03:00
   */
  createdAt: string;
  /*
   * Cart most recent update date in ISO format e.g. 2020-06-10T16:01:04.991+03:00
   */
  modifiedAt: string;
}

export interface CartAddItemCommand {
  /*
   * Required catalogue asset PID
   */
  assetId: string;
  /*
   * Required pricing model unique key (the key must be one of the supported pricing models
   * returned by the catalogue, for the specific asset selected by the assetId
   * property)
   */
  pricingModelKey: string;
  /**
   * System and user-defined quotation parameters. User-defined parameters are set by the user.
   * System parameters are computed by the quotation service e.g. the population for a selected
   * area
   */
  parameters: QuotationParameters;
}
