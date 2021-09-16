import { EnumSpatialOperation, EnumTopicCategory } from "./catalogue";
import { EnumAssetType } from "./enum";

interface FilterType {
    id: EnumAssetType,
    name: string,
    pillLabel: string,
    isChecked: boolean,
}

interface FilterTopic {
    id: EnumTopicCategory,
    name: string,
    pillLabel: string,
    isChecked: boolean,
}

interface FilterUpdated {
    dateFrom: string,
    dateTo: string,
    timeFrom: string,
    timeTo: string,
}

interface FilterFormats {
    api: { id: string, name: string, isChecked: boolean }[],
    vector: { id: string, name: string, isChecked: boolean }[],
    raster: { id: string, name: string, isChecked: boolean }[],
}

interface FilterCRS {
    code: string,
    description: string,
    isChecked?: boolean,
}

interface FilterNumberOfFeatures {
    isSmallChecked: boolean,
    isMediumChecked: boolean,
    isLargeChecked: boolean,
}

interface FilterLanguage {
    code: string,
    name: string,
    isChecked: boolean,
}

interface FilterLicense {
    id: string,
    name: string,
    pillLabel: string,
    isChecked: boolean,
}

interface Filters {
    types: FilterType[],
    formats: FilterFormats,
    updated: FilterUpdated,
    topics: FilterTopic[],
    scaleValues: number[],
    crsList: FilterCRS[],
    mapCoverageSelectionBBox: string,
    spatialOperation: EnumSpatialOperation,
    priceMin: number | null,
    priceMax: number | null,
    numberOfFeatures: FilterNumberOfFeatures,
    attributes: string[],
    vendors: string[],
    languages: FilterLanguage[],
    licenses: FilterLicense[],
}

export { Filters, FilterCRS };