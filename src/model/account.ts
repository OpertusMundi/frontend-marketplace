import { EnumRole, EnumVendorRole } from './role';
import { EnumAuthProvider } from './configuration';

export enum EnumAccountType {
  OPERTUSMUNDI = 'OPERTUSMUNDI',
  VENDOR = 'VENDOR',
}

export enum EnumActivationStatus {
  UNDEFINED = 'UNDEFINED',
  PENDING = 'PENDING',
  PROCESSING = 'PROCESSING',
  COMPLETED = 'COMPLETED',
}

export enum EnumMangopayUserType {
  INDIVIDUAL = 'INDIVIDUAL',
  PROFESSIONAL = 'PROFESSIONAL',
}

export enum EnumLegalPersonType {
  BUSINESS = 'BUSINESS',
  ORGANIZATION = 'ORGANIZATION',
  SOLETRADER = 'SOLETRADER',
}

export enum EnumCustomerType {
  CONSUMER = 'CONSUMER',
  PROVIDER = 'PROVIDER',
}

export enum EnumCustomerRegistrationStatus {
  DRAFT = 'DRAFT',
  CANCELLED = 'CANCELLED',
  SUBMITTED = 'SUBMITTED',
  COMPLETED = 'COMPLETED',
}

export enum EnumKycLevel {
  /**
   * KYC documents have not been submitted or not validated
   */
  LIGHT = 'LIGHT',
  /**
   * Customer KYC documents have been submitted and validated
   */
  REGULAR = 'REGULAR',
}

export enum EnumAccountSortField {
  EMAIL = 'EMAIL',
  FIRST_NAME = 'FIRST_NAME',
  LAST_NAME = 'LAST_NAME',
}

/**
 * Activation token command
 */
export interface ActivationTokenCommand {
  /**
   * Email address to verify
   */
  email: string;
}

/**
 * Address base interface
 */
interface AddressBase {
  city: string;
  /**
   * Country 2-letter code e.g. GR
   *
   * https://en.wikipedia.org/wiki/ISO_3166-1_alpha-2
   */
  country: string;
  line1: string;
  line2: string | null;
  postalCode: string;
  region: string;
}

/**
 * Address command
 */
// eslint-disable-next-line
export interface AddressCommand extends AddressBase {

}

/**
 * Address
 */
// eslint-disable-next-line
export interface Address extends AddressBase {

}

/**
 * Bank account base interface
 */
export interface BankAccountBase {
  ownerName: string;
  iban: string;
  bic: string;
}

/**
 * Bank account command
 */
export interface BankAccountCommand extends BankAccountBase {
  ownerAddress: AddressCommand;
}

/**
 * Bank account
 */
export interface BankAccount extends BankAccountBase {
  ownerAddress: Address;
}

/**
 * Professional customer legal representative base interface
 */
export interface CustomerRepresentativeBase {
  /**
   * The person's birth date with YYYY-MM-DD format
   */
  birthdate: string;
  /**
   * The representative country of residence. ISO 3166-1 alpha-2 format is expected
   *
   * https://en.wikipedia.org/wiki/ISO_3166-1_alpha-2
   */
  countryOfResidence: string;
  email: string;
  firstName: string;
  lastName: string;
  /**
   * The representative nationality. ISO 3166-1 alpha-2 format is expected
   *
   * https://en.wikipedia.org/wiki/ISO_3166-1_alpha-2
   */
  nationality: string;
}

/**
 * Professional customer legal representative command
 */
export interface CustomerRepresentativeCommand extends CustomerRepresentativeBase {
  address: AddressCommand;
}

/**
 * Professional customer legal representative
 */
export interface CustomerRepresentative extends CustomerRepresentativeBase {
  address: Address;
}

/**
 * Customer (Consumer/Provider) command base interface
 */
interface CustomerCommand {
  email: string;
  /**
   * Customer type
   */
  type: EnumMangopayUserType;
}

/**
 * Individual consumer customer command
 *
 * Property type value expected to be INDIVIDUAL
 */
export interface ConsumerIndividualCommand extends CustomerCommand {
  address: AddressCommand,
  /**
   * The customer's birth date with YYYY-MM-DD format
   */
  birthdate: string;
  /**
   * The customer country of residence. ISO 3166-1 alpha-2 format is expected
   *
   * https://en.wikipedia.org/wiki/ISO_3166-1_alpha-2
   */
  countryOfResidence: string;
  firstName: string;
  lastName: string;
  /**
   * The customer nationality. ISO 3166-1 alpha-2 format is expected
   *
   * https://en.wikipedia.org/wiki/ISO_3166-1_alpha-2
   */
  nationality: string;
  occupation: string;
}

/**
 * Professional consumer customer command
 *
 * Property type value expected to be PROFESSIONAL
 */
export interface ConsumerProfessionalCommand extends CustomerCommand {
  additionalInfo?: string;
  /**
   * VAT number
   */
  companyNumber: string;
  companyType: string;
  headquartersAddress: AddressCommand;
  legalPersonType: EnumLegalPersonType;
  representative: CustomerRepresentativeCommand;
  /**
   * Base64 encoded company logo image
   */
  logoImage: string;
  /**
   * Company logo image mime type (used with image property to create a data URL)
   */
  logoImageMimeType: string;
  name: string;
  phone: string;
  siteUrl: string;
}

/**
 * Professional provider customer command
 *
 * Property type value expected to be PROFESSIONAL
 */
export interface ProviderProfessionalCommand extends ConsumerProfessionalCommand {
  bankAccount: BankAccountCommand;
}

/**
 * Customer (Consumer/Provider) draft base interface
 */
interface CustomerDraft {
  createdAt: string;
  email: string;
  modifiedAt: string;
  status: EnumCustomerRegistrationStatus;
  type: EnumMangopayUserType;
}

/**
 * Individual customer (Consumer) draft
 */
export interface CustomerDraftIndividual extends CustomerDraft {
  address: Address;
  birthdate: string;
  countryOfResidence: string;
  firstName: string;
  lastName: string;
  nationality: string;
  occupation: string;
}

/**
 * Professional customer (Consumer/Professional) draft
 */
export interface CustomerDraftProfessional extends CustomerDraft {
  additionalInfo: string;
  bankAccount: BankAccount;
  companyNumber: string;
  companyType: string;
  headquartersAddress: Address;
  legalPersonType: EnumLegalPersonType;
  /**
   * Base64 encoded company logo image
   */
  logoImage: string;
  /**
   * Company logo image mime type (used with image property to create a data URL)
   */
  logoImageMimeType: string;
  name: string;
  phone: string;
  representative: CustomerRepresentative;
  siteUrl: string;
}

/**
 * Customer (Consumer/Processional) base interface
 */
interface Customer {
  /**
   * Contract reference
   */
  contract: string;
  createdAt: string;
  email: string;
  emailVerified: boolean;
  emailVerifiedAt: string;
  kycLevel: EnumKycLevel;
  modifiedAt: string;
  type: EnumMangopayUserType;
  /**
   * Wallet funds. Wallet data is updated when a new PayIn, Transfer or PayOut is created.
   */
  walletFunds: number;
  /**
   * Wallet last update. Wallet data is updated when a new PayIn, Transfer or PayOut is created.
   */
  walletFundsUpdatedOn: string;
}

/**
 * Individual customer (Consumer)
 */
export interface CustomerIndividual extends Customer {
  address: Address;
  birthdate: string;
  countryOfResidence: string;
  firstName: string;
  lastName: string;
  nationality: string;
  occupation: string;
}

/**
 * Professional customer (Consumer/Provider)
 */
export interface CustomerProfessional extends Customer {
  additionalInfo: string;
  bankAccount: BankAccount;
  companyNumber: string;
  companyType: string;
  headquartersAddress: Address;
  legalPersonType: EnumLegalPersonType;
  /**
   * Base64 encoded company logo image
   */
  logoImage: string;
  /**
   * Company logo image mime type (used with image property to create a data URL)
   */
  logoImageMimeType: string;
  name: string;
  phone: string;
  rating: number | null;
  representative: CustomerRepresentative;
  siteUrl: string;
}

/**
 * Profile consumer related data
 */
interface ConsumerData {
  /**
   * Current consumer data. If a consumer is not registered, null is returned.
   */
  current: CustomerIndividual | CustomerProfessional | null;
  /**
   * Consumer draft data. If no update is active, null is returned.
   */
  draft: CustomerDraftIndividual | CustomerDraftProfessional | null;
  /**
   * True if the account is a registered consumer
   */
  registered: boolean;
}

/**
 * Profile provider related data
 */
interface ProviderData {
  /**
   * Current provider data. If provider is not registered, null is returned.
   */
  current: CustomerProfessional | null;
  /**
   * Provider draft data. If no update is active, null is returned.
   */
  draft: CustomerDraftProfessional | null;
  /**
   * True if the account is a registered provider.
   */
  registered: boolean;
}

/**
 * Profile base interface
 */
interface ProfileBase {
  /**
   * Base64 encoded user image
   */
  image?: string;
  /**
   * User image mime type (used with image property to create a data URL)
   */
  imageMimeType?: string;
  /**
   * Locale ISO 3166-1 alpha-2 code e.g. el. Default is en.
   */
  locale: string;
  /**
   * User phone
   */
  phone: string;
}

/**
 * Profile update command
 */
export interface AccountProfileCommand extends ProfileBase {
  /**
   * First name
   */
  firstName: string;
  /**
   * Last name
   */
  lastName: string;
  /**
   * User mobile
   */
  mobile: string;
}

/**
 * Profile
 */
export interface Profile extends ProfileBase {
  /**
   * Consumer related data
   */
  consumer: ConsumerData;
  /**
   * Profile creation date
   */
  createdOn: string;
  /**
   * First name
   */
  firstName: string;
  /**
   * Last name
   */
  lastName: string;
  /**
   * User mobile
   */
  mobile: string;
  /**
   * Profile most recent update date
   */
  modifiedOn: string;
  /**
   * Provider related data
   */
  provider: ProviderData;
}

/**
 * Account command
 */
export interface PlatformAccountCommand {
  /**
   * User email. Must be unique
   */
  email: string;
  /**
   * Account password
   */
  password: string;
  /**
   * Account profile
   */
  profile: AccountProfileCommand;
  /**
   * Account password verification. Must match property password
   */
  verifyPassword: string;
}

/**
 * Account command
 */
export interface VendorAccountCommand {
  /**
   * User email. Must be unique
   */
  email: string;
  /**
   * Account profile
   */
  profile: AccountProfileCommand;
  /**
   * Vendor account roles
   */
  roles: EnumVendorRole[];
}

/**
 * Account
 */
export interface Account {
  /**
   * True if the account is active
   */
  active: boolean;
  /**
   * Date of account activation. Activation occurs when the user verifies his email address.
   * The date is in ISO format.
   */
  activatedAt: string;
  /**
   * Activation status
   */
  activationStatus: EnumActivationStatus;
  /**
   * User email. Must be unique
   */
  email: string;
  /**
   * True if the email address is verified
   */
  emailVerified: boolean;
  /**
   * Date of email verification
   */
  emailVerifiedAt: string;
  /**
   * IDP name used for account registration. A value from enum  {@link EnumAuthProvider}
   */
  idpName: EnumAuthProvider;
  /**
   * User name as retrieved by the IDP user info endpoint
   */
  idpUserName: string;
  /**
   * User image URL as retrieved by the IDP user info endpoint
   */
  idpUserImage: string;
  /**
   * User unique key
   */
  key: string;
  /**
   * User profile
   */
  profile: Profile;
  /**
   * Date of registration in ISO format
   */
  registeredAt: string;
  /**
   * User roles. Every authenticated user has at least role ROLE_USER
   */
  roles: EnumRole[];
  /**
   * User name (always equal to user email)
   */
  username: string;
}

export interface PasswordChangeCommand {
  /**
   * Current password of the authenticated user
   */
  currentPassword: string;
  /**
   * New password
   */
  newPassword: string;
  /**
   * New password verification. Must match property `newPassword`
   */
  verifyNewPassword: string;
}

export interface JoinVendorCommand {
  /**
   * User email. Must match the registered mail
   */
  email: string;
  /**
   * New vendor account password
   */
  password: string;
  /**
   * New vendor account password verification. Must match property password.
   */
  verifyPassword: string;
}

/**
 * Provider summary interface
 */
export interface Provider {
  /*
   * Company location (city)
   */
  city: string;
  /*
   * Company country
   */
  country: string;
  /**
   * Company contact email. This is the email address from the
   * provider's profile. The email is returned only if it has been
   * verified.
   */
  email: string | null;
  /**
   * The favorite record unique key, if the provider is already added to
   * the user's favorite list. For performance reasons, this value is returned
   * only when the provider object is loaded as a part of a catalogue item response.
   */
  favorite: string | null;
  /*
   * Provider registration date in ISO format e.g. 2020-06-10T16:01:04.991+03:00
   */
  joinedAt: string;
  /*
   * Publisher unique id
   */
  id: string;
  /*
   * Base64 encoded company logo image
   */
  logoImage: string;
  /*
   * Company logo image mime type (used with image property to create a data URL)
   */
  logoImageMimeType: string;
  /*
   * Company name
   */
  name: string;
  /*
   * Average rating. If no user ratings exist, null is returned
   */
  rating: number | null;
}

/**
 * Consumer summary interface
 */
export interface Consumer {
  /**
   * Consumer unique key
   */
  id: string;
  /**
   * Consumer name
   */
  name: string;
  /**
   * Consumer country
   */
  country: string;
}

/**
 * Provider optional topio fields
 */
export interface ProviderProfileCommand {
  /**
   * Additional provider's info
   */
  additionalInfo: string;
  /**
   * Company type description
   */
  companyType: string;
  /**
   * Company logo image using Base64 encoding
   */
  logoImage: string;
  /**
   * Company log image MIME type
   */
  logoImageMimeType: string;
  /**
   * Provider contact phone
   */
  phone: string;
  /**
   * Provider site URL
   */
  siteUrl: string;
}
