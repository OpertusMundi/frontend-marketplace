import { Provider } from './account';

export enum EnumFavoriteSortField {
  CREATED_ON = 'CREATED_ON',
  TITLE = 'TITLE',
}

export enum EnumFavoriteType {
  ASSET = 'ASSET',
  PROVIDER = 'PROVIDER',
}

interface FavoriteCommand {
  type: EnumFavoriteType;
}

export interface FavoriteAssetCommand extends FavoriteCommand {
  pid: string;
}

export interface FavoriteProviderCommand extends FavoriteCommand {
  publisherKey: string;
}

export interface Favorite {
  key: string;
  title: string;
  type: EnumFavoriteType;
}

export interface FavoriteAsset extends Favorite {
  assetId: string;
  assetVersion: string;
}

export interface FavoriteProvider extends Favorite {
  provider: Provider;
}
