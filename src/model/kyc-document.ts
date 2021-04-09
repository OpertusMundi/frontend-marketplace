import { EnumCustomerType } from '@/model/account';
import { QueryResultPage } from '@/model/request';
import { ServerResponse } from '@/model/response';

export enum EnumKycDocumentStatus {
  CREATED = 'CREATED',
  VALIDATION_ASKED = 'VALIDATION_ASKED',
  VALIDATED = 'VALIDATED',
  REFUSED = 'REFUSED',
  OUT_OF_DATE = 'OUT_OF_DATE',
}

export enum EnumKycDocumentType {
  IDENTITY_PROOF = 'IDENTITY_PROOF',
  ADDRESS_PROOF = 'ADDRESS_PROOF',
  REGISTRATION_PROOF = 'REGISTRATION_PROOF',
  ARTICLES_OF_ASSOCIATION = 'ARTICLES_OF_ASSOCIATION',
  SHAREHOLDER_DECLARATION = 'SHAREHOLDER_DECLARATION',
}

export interface KycDocumentCommand {
  /**
   * The customer type. For a consumer or provider, the authenticated user must
   * have the `ROLE_CONSUMER` or `ROLE_PROVIDER` role respectively
   */
  customerType: EnumCustomerType;
  /**
   * The type of the KYC document
   */
  type: EnumKycDocumentType
}

export interface KycDocument {
  /**
   * Document unique identifier
   */
  id: string;
  /**
   * The type of the KYC document
   */
  type: EnumKycDocumentType;
  /**
   * Document status
   */
  status: EnumKycDocumentStatus;
  /**
   * Document rejection reason type
   */
  refusedReasonType: string;
  /**
   * Document rejection reason message
   */
  refusedReasonMessage: string;
  /**
   * Creation date in ISO format
   */
  createdOn: string;
  /**
   * Processing date in ISO format
   */
  processedOn: string;
}

export interface KycDocumentPageCommand {
  /**
   * The customer type. For a consumer or provider, the authenticated user must
   * have the `ROLE_CONSUMER` or `ROLE_PROVIDER` role respectively
   */
  customerType: EnumCustomerType;
  /**
   * Optional comment
   */
  comment: string;
}

export interface KycDocumentPage {
  /**
   * Upload date in ISO format
   */
  uploadedOn: string;
  /**
   * Original file name
   */
  fileName: string;
  /**
   * File mime type
   */
  fileType: string;
  /**
   * File size in bytes
   */
  fileSize: number;
}

export type KycDocumentQueryResponse = ServerResponse<QueryResultPage<KycDocument>>;
