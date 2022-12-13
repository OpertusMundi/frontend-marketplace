import { EnumAssetType } from '@/model/enum';

// eslint-disable-next-line
export const assetTypeColorMappings: {
  type: EnumAssetType,
  color: string,
}[] = [
  { type: EnumAssetType.VECTOR, color: '#358F8B' },
  { type: EnumAssetType.RASTER, color: '#358F8B' },
  { type: EnumAssetType.NETCDF, color: '#358F8B' },
  { type: EnumAssetType.TABULAR, color: '#358F8B' },
  { type: EnumAssetType.SERVICE, color: '#6F43B5' },
  { type: EnumAssetType.SENTINEL_HUB_OPEN_DATA, color: '#197196' },
  { type: EnumAssetType.BUNDLE, color: '#A2A644' },
];
