import { AddressCommand } from '@/model/account';
import { QueryResultPage } from '@/model/request';
import { ServerResponse } from '@/model/response';

export enum EnumUboDeclarationStatus {
  CREATED = 'CREATED',
  VALIDATION_ASKED = 'VALIDATION_ASKED',
  INCOMPLETE = 'INCOMPLETE',
  VALIDATED = 'VALIDATED',
  REFUSED = 'REFUSED',
}

export interface Birthplace {
  /**
   * The city of the address
   */
  city: string;
  /**
   * The country of the Address
   *
   * {@see https://en.wikipedia.org/wiki/ISO_3166-1_alpha-2}
   */
  country: string;
}

export interface UboCommand {
  /**
   * The name of the UBO (required)
   */
  firstName: string;
  /**
   * The last name of the UBO (required)
   */
  lastName: string;
  /**
   * The UBO address (required)
   */
  address: AddressCommand
  /**
   * The UBO nationality. ISO 3166-1 alpha-2 format is expected (required)
   *
   * {@see https://en.wikipedia.org/wiki/ISO_3166-1_alpha-2}
   */
  nationality: string;
  /**
   * Birthdate in ISO format (required)
   */
  birthdate: string;
  /**
   * The UBO's birthplace (required)
   */
  birthplace: Birthplace;
}

export interface Ubo {
  /**
   * UBO's unique identifier
   */
  id: string;
  /**
   * The name of the UBO
   */
  firstName: string;
  /**
   * The last name of the UBO
   */
  lastName: string;
  /**
   * The UBO address
   */
  address: AddressCommand
  /**
   * The UBO nationality. ISO 3166-1 alpha-2 format is expected
   *
   * {@see https://en.wikipedia.org/wiki/ISO_3166-1_alpha-2}
   */
  nationality: string;
  /**
   * Birthdate in ISO format
   */
  birthdate: string;
  /**
   * The UBO's birthplace
   */
  birthplace: Birthplace;
}

export interface UboDeclaration {
  /**
   * UBO declaration unique identifier
   */
  id: string;
  /**
   * UBO declaration status
   */
  status: EnumUboDeclarationStatus;
  /**
   * Rejection reason type
   */
  refusedReasonType: string;
  /**
   * Rejection reason message
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
  /**
   * Declaration UBOs
   */
  ubos: Ubo[];
}

export type UboDeclarationQueryResponse = ServerResponse<QueryResultPage<UboDeclaration>>;
