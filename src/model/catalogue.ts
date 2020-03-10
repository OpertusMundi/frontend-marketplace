export enum EnumType {
  Raster = 'Raster',
  Vector = 'Vector',
}

export enum EnumFormat {
  CSV = 'CSV',
  ShapeFile = 'ShapeFile',
}

export enum EnumService {
  WFS = 'WFS',
  WMS = 'WMS',
}

export interface Seller {
  id: string;
  title: string;
}

export interface CatalogueItem {
  boundingBox: GeoJSON.BBox;
  creator: string;
  description: string;
  format: EnumFormat;
  id: string;
  price: number;
  rating: number;
  services: EnumService[];
  title: string;
  type: EnumType;
  version: string;

}

export interface CatalogueSearchResult {
  pageRequest: {
    page: number;
    size: number;
  };
  count: number;
  items: CatalogueItem[];
}
