export enum EnumContinent {
  AFRICA = 'AFRICA',
  NORTH_AMERICA = 'NORTH_AMERICA',
  OCEANIA = 'OCEANIA',
  ANTARCTICA = 'ANTARCTICA',
  ASIA = 'ASIA',
  EUROPE = 'EUROPE',
  SOUTH_AMERICA = 'SOUTH_AMERICA',
}

export enum EnumAssetType {
  BUNDLE = 'BUNDLE',
  NETCDF = 'NETCDF',
  RASTER = 'RASTER',
  SERVICE = 'SERVICE',
  TABULAR = 'TABULAR',
  VECTOR = 'VECTOR',
}

export enum EnumAssetTypeCategory {
  DATA_FILE = 'DATA_FILE',
  API = 'API',
  COLLECTION = 'COLLECTION',
}

export enum EnumSpatialDataServiceType {
  TMS = 'TMS',
  WMS = 'WMS',
  WFS = 'WFS',
  WCS = 'WCS',
  CSW = 'CSW',
  DATA_API = 'DATA_API',
  OGC_API = 'OGC_API',
}

export enum EnumPaymentMethod {
  /**
   * Free (no payment required)
   */
  FREE = 'FREE',
  /**
   * Payment with registered card
   */
  CARD_DIRECT = 'CARD_DIRECT',
  /**
   * Payment using bankwire transfer
   */
  BANKWIRE = 'BANKWIRE',
}
