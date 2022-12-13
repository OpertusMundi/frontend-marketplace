import { EnumAssetType } from '@/model/enum';

// eslint-disable-next-line
export const assetTypeColorMappings: {
  type: EnumAssetType,
  color: string,
  icon: string,
}[] = [
  { type: EnumAssetType.VECTOR, color: '#90ff00', icon: '' },
  { type: EnumAssetType.RASTER, color: 'blue', icon: '' },
  { type: EnumAssetType.SERVICE, color: 'green', icon: '' },
  { type: EnumAssetType.SENTINEL_HUB_OPEN_DATA, color: 'yellow', icon: '' },
  { type: EnumAssetType.BUNDLE, color: 'dodgerblue', icon: '' },
];
