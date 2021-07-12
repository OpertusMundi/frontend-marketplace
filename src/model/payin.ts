import { EnumPaymentMethod } from '@/model/enum';
import { BankAccount, Consumer } from '@/model/account';
import { ConsumerOrder, ProviderOrder } from '@/model/order';
import { ConsumerAccountSubscription, ProviderAccountSubscription } from '@/model/account-asset';

export enum EnumCardType {
  CB_VISA_MASTERCARD = 'CB_VISA_MASTERCARD',
}

export enum EnumCardValidity {
  /**
  * UNKNOWN validity.
  */
  UNKNOWN,
  /**
  * VALID validity.
  */
  VALID,
  /**
  * INVALID validity.
  */
  INVALID
}

export enum EnumPaymentItemType {
  ORDER = 'ORDER',
  SUBSCRIPTION_BILLING = 'SUBSCRIPTION_BILLING',
}

export enum EnumTransactionStatus {
  /**
   * New payment, no PayIn has been created yet
   */
  CREATED = 'CREATED',
  /**
   * PayIn failed
   */
  FAILED = 'FAILED',
  /**
   * PayIn succeeded
   */
  SUCCEEDED = 'SUCCEEDED',
}

export enum EnumPayInSortField {
  EXECUTED_ON = 'EXECUTED_ON',
  REFERENCE_NUMBER = 'REFERENCE_NUMBER',
  TOTAL_PRICE = 'TOTAL_PRICE',
}

export enum EnumPayInItemSortField {
  CREATED_ON = 'CREATED_ON',
  EXECUTED_ON = 'EXECUTED_ON',
  MODIFIED_ON = 'MODIFIED_ON',
  REFERENCE_NUMBER = 'REFERENCE_NUMBER',
  STATUS = 'STATUS',
}

export interface Transfer {
  /**
   * Funds debited from buyer's wallet and credited to seller's wallet
   */
  creditedFunds: number;
  /**
   * Platform fees
   */
  fees: number;
  /**
   * Transaction status
   */
  status: EnumTransactionStatus;
  /**
   * Date of creation in ISO format
   */
  createdOn: string;
  /**
   * Date of execution in ISO format
   */
  executedOn: string;
}

interface SubscriptionBilling {
  /**
   * Service unique PID
   */
  service: string;
  /**
   * Service description
   */
  subscriptionDescription: string;
  /**
   * Billing interval first date in ISO format e.g. 2020-06-10T16:01:04.991+03:00
   */
  fromDate: string;
  /**
   * Billing interval last date in ISO format e.g. 2020-07-10T16:01:04.991+03:00
   */
  toDate: string;
  /**
   * Total rows charged in this record. This field is exclusive with field `totalCalls`
   */
  totalRows: number;
  /**
   * Total calls charged in this record. This field is exclusive with field `totalRows`
   */
  totalCalls: number;
  /**
   * Total rows used by purchased SKUs. This field is exclusive with field `skuTotalCalls`
   */
  skuTotalRows: number;
  /**
   * Total calls used by purchased SKUs. This field is exclusive with field `skuTotalRows`
   */
  skuTotalCalls: number;
  /**
   * Item total price
   */
  totalPrice: number;
  /**
   * Item price excluding tax
   */
  totalPriceExcludingTax: number;
  /**
   * Item tax
   */
  totalTax: number;
}

export interface ConsumerSubscriptionBilling extends SubscriptionBilling {
  /**
   * Consumer subscription
   */
  subscription: ConsumerAccountSubscription;
}

export interface ProviderSubscriptionBilling extends SubscriptionBilling {
  /**
   * Consumer subscription
   */
  subscription: ProviderAccountSubscription;
}

interface PayInItem {
  /**
   * Invoice line number
   */
  index: number;
  /**
   * Parent PayIn unique key
   */
  payIn: string;
  /**
   * Payment item type
   */
  type: EnumPaymentItemType;
}

export interface ProviderPayInItem {
  /**
   * Transfer of funds from the buyer's to the seller's wallet
   */
  transfer?: Transfer;
}

export interface ConsumerOrderPayInItem extends PayInItem {
  /**
   * Order
   */
  order: ConsumerOrder;
}

export interface ConsumerSubscriptionBillingPayInItem extends PayInItem {
  /**
   * PayIn subscription billing record
   */
  subscriptionBilling: ConsumerSubscriptionBilling;
}

export interface ProviderOrderPayInItem extends ProviderPayInItem {
  /**
   * Order
   */
  order: ProviderOrder;
}

export interface ProviderSubscriptionBillingPayInItem extends ProviderPayInItem {
  /**
   * PayIn subscription billing record
   */
  subscriptionBilling: ProviderSubscriptionBilling;
}

interface PayIn {
  /**
   * PayIn unique key
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
  totalTax: number;
  /**
   * The currency in ISO 4217 format. Only `EUR` is supported
   */
  currency: string;
  /**
   * PayIn creation date in ISO format
   */
  createdOn: string
  /**
   * PayIn execution date in ISO format
   */
  executedOn: string;
  /**
   * Transaction status
   */
  status: EnumTransactionStatus;
  /**
   * Date of transaction status last update in ISO format
   */
  statusUpdatedOn: string;
  /**
   * Payment method
   */
  paymentMethod: EnumPaymentMethod;
  /**
   * Platform reference number
   */
  referenceNumber: string;
}

export interface ConsumerPayIn extends PayIn {
  /**
   * PayIn payments. A PayIn may include a single order or multiple subscription billing records
   */
  items?: (ConsumerOrderPayInItem | ConsumerSubscriptionBillingPayInItem)[];
}

export interface ProviderPayIn extends PayIn {
  /**
   * Consumer
   */
  consumer: Consumer;
  /**
   * PayIn payments. A PayIn may include a single order or multiple subscription billing records
   */
  items?: (ProviderOrderPayInItem | ProviderSubscriptionBillingPayInItem)[];
}

export interface PayInStatus {
  /**
   * Transaction status
   */
  status: EnumTransactionStatus;
  /**
   * Date of update in ISO format
   */
  updatedOn: string;
}

export interface ConsumerBankwirePayIn extends ConsumerPayIn {
  /**
   * The user has to proceed a Bank wire with this reference
   */
  wireReference: string;
  /**
   * The user has to proceed a Bank wire to this bank account
   */
  bankAccount?: BankAccount;
}

export interface ProviderBankwirePayIn extends ProviderPayIn {
  /**
   * The user has to proceed a Bank wire with this reference
   */
  wireReference: string;
  /**
   * The user has to proceed a Bank wire to this bank account
   */
  bankAccount?: BankAccount;
}

export interface ConsumerCardDirectPayIn extends ConsumerPayIn {
  /**
   * A partially obfuscated version of the credit card number
   */
  alias?: string;
  /**
   * A custom description to appear on the user's bank statement
   */
  statementDescriptor: string;
  /**
   * Redirect URL if 3-D Secure validation is required. If not empty, the client
   * must initiate the 3-D Secure validation process.
   */
  secureModeRedirectURL?: string;
}

export interface ProviderCardDirectPayIn extends ProviderPayIn {
  /**
   * A partially obfuscated version of the credit card number
   */
  alias?: string;
  /**
   * A custom description to appear on the user's bank statement
   */
  statementDescriptor: string;
}

export interface CardDirectPayInCommand {
  /**
   * A registered card unique identifier
   */
  cardId: string;
}

export interface Card {
  /**
   * Whether the card is active or not
   */
  active: boolean;
  /**
   * A partially obfuscated version of the credit card number
   */
  alias: string;
  /**
   * The type of card. Currently only a single card type is supported, `CB_VISA_MASTERCARD`
   */
  cardType: EnumCardType;
  /**
   * The currency in ISO 4217 format
   */
  currency: string;
  /**
   * The expiry date of the card in `MMYY` format
   */
  expirationDate: string;
  /**
   * Card unique identifier. This identifier is required for creating a card direct PayIn
   */
  id: string;
  /**
   * Card validity. A successful transaction (PreAuthorization or PayIn) is required to validate a card id
   */
  validity: EnumCardValidity;
  /**
   * The expiry month of the card
   */
  expirationMonth: number;
  /**
   * The expiry year of the card
   */
  expirationYear: number;
}

/**
 * Card registration data required by the API Gateway for completing the registration of card
 */
export interface CardRegistrationCommand {
  /**
   * Registration identifier created when initialized the card registration
   */
  registrationId: string;
  /**
   * Card registration data returned by the tokenization server
   */
  registrationData: string;
}

/**
 * Card registration data required by the tokenization server
 *
 * {@see https://docs.mangopay.com/endpoints/v2.01/cards#e1042_post-card-info}
 */
 export interface CardRegistration {
  /**
   * Registration identifier required for submitting the tokenization server response
   */
  registrationId: string;
  /**
   * Value required for property `accessKeyRef` of tokenization server request
   */
  accessKey: string;
  /**
   * Card tokenization server URL. Client must submit the card details to this URL
   */
  cardRegistrationUrl: string;
  /**
   * Value required for property `data` of tokenization server request
   */
  preRegistrationData: string;
}
