import { Provider } from './account';
import { CatalogueItemDetails } from './catalogue';

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
  type: EnumFavoriteType;
}

export interface FavoriteAsset extends Favorite {
  asset: CatalogueItemDetails;
}

export interface FavoriteProvider extends Favorite {
  provider: Provider;
}
