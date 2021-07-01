import { EnumTransactionStatus } from './payin';
import { Refund } from './refund';

export interface PayOutDto {
  /**
   * Payout platform unique key
   */
  key: string;
  /**
   * Information about the funds that are being debited from seller's wallet
   */
  debitedFunds: number;
  /**
   * Information about the fees that were taken by the client for this transaction
   */
  fees: number;
  /**
   * The currency in ISO 4217 format. Only `EUR` is supported"
   */
  currency: string;
  /**
   * Transaction status
   */
  status: EnumTransactionStatus;
  /**
   * Date of transaction status last update in ISO format
   */
  statusUpdatedOn: string;
  /**
   * Date of creation in ISO format
   */
  createdOn: string;
  /**
   * Date of execution in ISO format
   */
  executedOn: string;
  /**
   * A custom reference that will appear on the user’s bank statement
   */
  bankwireRef: string;
  /**
   * Refund
   */
  refund?: Refund;
}
