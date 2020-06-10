export enum EnumPricingModel {
  /**
   * Invalid pricing model
   */
  UNDEFINED = 'UNDEFINED',
  /*
   * Free
   */
  FREE = 'FREE',
  /**
   * Fixed payment model
   */
  FIXED = 'FIXED',
  /**
   * Subscription based payment model
   */
  SUBSCRIPTION = 'SUBSCRIPTION',
}

export interface BasePricingModel {
  /*
   * Model unique identifier
   */
  id: string;
  /*
   * Tax percent in range [0, 100]
   */
  taxPercent: number;
  /*
   * Price excluding tax
   */
  totalPriceExcludingTax: number;
  /*
   * Price tax
   */
  tax: number;
  /*
   * Price total including tax
   */
  totalPrice: number;
  /*
   * Currency of monetary values (always EUR)
   */
  currency: string;
}

export interface FreePricingModel extends BasePricingModel {
  /*
   * Discriminator field used for deserializing the model to the appropriate data type
   */
  type: EnumPricingModel.FREE;
}

export interface FixedPricingModel extends BasePricingModel {
  /*
   * Discriminator field used for deserializing the model to the appropriate data type
   */
  type:  EnumPricingModel.FIXED;
  /*
   * True if pricing model includes updates
   */
  includesUpdates: boolean;
  /*
   * Number of years for included updates
   */
  yearsOfUpdates: number;
}

export interface SubscriptionPricingModel extends BasePricingModel {
  /*
   * Discriminator field used for deserializing the model to the appropriate data type
   */
  type:  EnumPricingModel.SUBSCRIPTION;
  /*
   * Subscription duration in months
   */
  duration: number;
  /*
   * Monthly subscription price excluding tax
   */
  monthlyPrice: number;
}

export interface BasePricingModelCommand {

}

export interface FreePricingModelCommand extends BasePricingModelCommand {
  /*
   * Discriminator field used for deserializing the model to the appropriate data type
   */
  type: EnumPricingModel.FREE;
}

export interface FixedPricingModelCommand extends BasePricingModelCommand {
  /*
   * Discriminator field used for deserializing the model to the appropriate data type
   */
  type:  EnumPricingModel.FIXED;
  /*
   * True if pricing model includes updates
   */
  includesUpdates: boolean;
  /*
   * Number of years for included updates
   */
  yearsOfUpdates: number;
  /*
   * Price excluding tax
   */
  totalPriceExcludingTax: number;
}

export interface SubscriptionPricingModelCommand extends BasePricingModelCommand {
  /*
   * Discriminator field used for deserializing the model to the appropriate data type
   */
  type:  EnumPricingModel.SUBSCRIPTION;
  /*
   * Subscription duration in months
   */
  duration: number;
  /*
   * Monthly subscription price excluding tax
   */
  monthlyPrice: number;
}
