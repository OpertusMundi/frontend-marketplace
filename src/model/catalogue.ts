export interface CatalogueItem {
    id: string;
    title: string;
    description: string;
    creator: string;
    amount: number;
}

export interface CatalogueSearchResult {
    pageRequest: {
        page: number;
        size: number;
    },
    count: number;
    items: CatalogueItem[];
}