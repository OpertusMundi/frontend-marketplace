import { PageRequest, Sorting } from '@/model/request';
import { EnumAssetType } from './enum';

export enum EnumProviderAssetSortField {
    DATE_PUBLISHED = 'DATE_PUBLISHED',
    // PROVIDER = 'PROVIDER',
    TITLE = 'TITLE',
    TYPE = 'TYPE',
    // VERSION = 'VERSION',
}

export interface ProviderDraftQuery {
    q: string;
    type: EnumAssetType,
    pageRequest: PageRequest,
    sorting: Sorting<EnumProviderAssetSortField>,
}
