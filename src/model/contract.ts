export enum EnumContractIconCategory {
  Terms = 'Terms',
  Countries = 'Countries',
  Restrictions = 'Restrictions',
}

export enum EnumContractIcon {
  AlterationNotPermitted = 'AlterationNotPermitted',
  AlterationPermitted = 'AlterationPermitted',
  CommercialUseNotPermitted = 'CommercialUseNotPermitted',
  CommercialUsePermitted = 'CommercialUsePermitted',
  DeliveredByTopio = 'DeliveredByTopio',
  DeliveredByVendor = 'DeliveredByVendor',
  DigitalDelivery = 'DigitalDelivery',
  PhysicalDelivery = 'PhysicalDelivery',
  ThirdPartyNotPermitted = 'ThirdPartyNotPermitted',
  ThirdPartyPermitted = 'ThirdPartyPermitted',
  UpdatesNotIncluded = 'UpdatesNotIncluded',
  UpdatesIncluded = 'UpdatesIncluded',
  WarrantyNotProvided = 'WarrantyNotProvided',
  WarrantyProvided = 'WarrantyProvided',
  NoRestrictionsWorldwide = 'NoRestrictionsWorldwide',
  AdvertisingMarketing = 'AdvertisingMarketing',
  Geomarketing = 'Geomarketing ',
  IntranetApplications = 'IntranetApplications',
  MobileApplications = 'MobileApplications',
  NavigationMobility = 'NavigationMobility',
  WebApplications = 'WebApplications'
}

export enum EnumContractType {
  /**
   * Provider contract derived from a MASTER template
   */
  MASTER_CONTRACT = 'MASTER_CONTRACT',
  /**
   * Custom contract template uploaded by the provider
   */
  UPLOADED_CONTRACT = 'UPLOADED_CONTRACT',
  /**
   * Placeholder value for Open Datasets
   */
  OPEN_DATASET = 'OPEN_DATASET',
}

export interface AssetContractAnnex {
  /**
   * Annex resource file unique identifier
   */
  id: string;
  /**
   * The description of the file. If not set, the file name is used as text
   */
  description: string;
  /**
   * The file name
   */
  fileName: string;
  /**
   * File size (in bytes)
   */
  size: number;
  /**
   * Date of last update in ISO format
   */
  modifiedOn: string;
}
