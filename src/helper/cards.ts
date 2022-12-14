import { CatalogueItem, CatalogueItemCommand } from '@/model/catalogue';
import { EnumAssetType } from '@/model/enum';
import {
  BasePricingModelCommand,
  EnumPricingModel,
  FixedPopulationPricingModelCommand,
  FixedPricingModelCommand,
  FixedRowPricingModelCommand,
  FreePricingModelCommand,
  PerCallPricingModelCommand,
  PerRowPricingModelCommand,
  SHSubscriptionPricingModelCommand,
} from '@/model/pricing-model';
import { assetTypeColorMappings } from '@/config/asset-cards';

const getPriceOrMinimumPrice = (asset: CatalogueItem | CatalogueItemCommand): { prefix: string, value: string, suffix: string } => {
  const res = { prefix: '', value: '', suffix: '' };

  if (!asset.pricingModels || !asset.pricingModels.length) return { prefix: '', value: '', suffix: '' };

  // CatalogueItem
  if (asset.pricingModels[0] && 'model' in asset.pricingModels[0]) res.prefix = asset.pricingModels.length > 1 || (asset.pricingModels[0] && (![EnumPricingModel.FREE, EnumPricingModel.FIXED].includes(asset.pricingModels[0].model.type))) ? 'FROM' : '';
  // CatalogueItemCommand
  if (asset.pricingModels[0] && 'type' in asset.pricingModels[0]) res.prefix = asset.pricingModels.length > 1 || (asset.pricingModels[0] && (![EnumPricingModel.FREE, EnumPricingModel.FIXED].includes(asset.pricingModels[0].type))) ? 'FROM' : '';

  let minPrice = Infinity;
  for (let i = 0; i < asset.pricingModels.length; i += 1) {
    // const x = asset.pricingModels[i] as EffectivePricingModel;
    const x = asset.pricingModels[i];

    let pricingModel = {} as BasePricingModelCommand | FreePricingModelCommand | FixedPricingModelCommand | FixedRowPricingModelCommand | FixedPopulationPricingModelCommand | PerCallPricingModelCommand | PerRowPricingModelCommand;
    // CatalogueItem
    if ('model' in x) pricingModel = x.model;
    // CatalogueItemCommand
    if ('type' in x) pricingModel = x;

    if (pricingModel.type === EnumPricingModel.FREE) {
      minPrice = 0;
      res.value = 'FREE';
      res.suffix = '';
      break;
    }
    if (pricingModel.type === EnumPricingModel.FIXED && (pricingModel as FixedPricingModelCommand).totalPriceExcludingTax < minPrice) {
      minPrice = (pricingModel as FixedPricingModelCommand).totalPriceExcludingTax;
      res.value = `${(pricingModel as FixedPricingModelCommand).totalPriceExcludingTax}`;
      res.suffix = '';
    }
    if (pricingModel.type === EnumPricingModel.FIXED_PER_ROWS && (pricingModel as FixedRowPricingModelCommand).price < minPrice) {
      minPrice = (pricingModel as FixedRowPricingModelCommand).price;
      res.value = `${(pricingModel as FixedRowPricingModelCommand).price}`;
      res.suffix = '1,000 rows';
    }
    if (pricingModel.type === EnumPricingModel.FIXED_FOR_POPULATION && (pricingModel as FixedPopulationPricingModelCommand).price < minPrice) {
      minPrice = (pricingModel as FixedPopulationPricingModelCommand).price;
      res.value = `${(pricingModel as FixedPopulationPricingModelCommand).price}`;
      res.suffix = '10,000 people';
    }
    if (pricingModel.type === EnumPricingModel.PER_CALL && (pricingModel as PerCallPricingModelCommand).price < minPrice) {
      minPrice = (pricingModel as PerCallPricingModelCommand).price;
      res.value = `${(pricingModel as PerCallPricingModelCommand).price}`;
      res.suffix = 'per call';
    }
    if (pricingModel.type === EnumPricingModel.PER_ROW && (pricingModel as PerRowPricingModelCommand).price < minPrice) {
      minPrice = (pricingModel as PerRowPricingModelCommand).price;
      res.value = `${(pricingModel as PerRowPricingModelCommand).price}`;
      res.suffix = 'per row';
    }
    // eslint-disable-next-line
    if (pricingModel.type === EnumPricingModel.SENTINEL_HUB_SUBSCRIPTION && (pricingModel as SHSubscriptionPricingModelCommand).monthlyPriceExcludingTax && (pricingModel as SHSubscriptionPricingModelCommand).monthlyPriceExcludingTax! < minPrice) {
      minPrice = (pricingModel as SHSubscriptionPricingModelCommand).monthlyPriceExcludingTax || 0;
      res.value = `${(pricingModel as SHSubscriptionPricingModelCommand).monthlyPriceExcludingTax}`;
      res.suffix = '';
    }
  }

  return res;
};

export const renderedPriceAsString = (price: { prefix: string, value: string, suffix: string }): string => {
  const prefix = price.prefix ? `${price.prefix} ` : '';
  const value = price.value !== 'FREE' ? `${price.value}€` : price.value;
  const suffix = price.suffix ? price.suffix : '';
  return `${prefix} ${value} ${suffix}`;
};

export const getAssetCardColor = (type: EnumAssetType): string => (
  assetTypeColorMappings.some((x) => x.type === type)
    ? assetTypeColorMappings.find((x) => x.type === type)?.color || ''
    : '#fff'
);

export default getPriceOrMinimumPrice;
