import { PageRequest, Sorting } from '@/model/request';
import { EnumAssetType } from './enum';

export enum EnumProviderAssetSortField {
    PROVIDER = 'PROVIDER',
    TITLE = 'TITLE',
    TYPE = 'TYPE',
    VERSION = 'VERSION',
}

export interface ProviderDraftQuery {
    q: string;
    type: EnumAssetType,
    pageRequest: PageRequest,
    sorting: Sorting<EnumProviderAssetSortField>,
}
