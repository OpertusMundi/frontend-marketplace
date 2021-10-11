import { CatalogueItem, CatalogueItemCommand } from '@/model/catalogue';
import {
  BasePricingModelCommand,
  CallBlockRatePricingModelCommand,
  CallPrePaidPricingModelCommand,
  EnumPricingModel,
  FixedPopulationPricingModelCommand,
  FixedPricingModelCommand,
  FixedRowPricingModelCommand,
  FreePricingModelCommand,
  RowBlockRatePricingModelCommand,
  RowPrePaidPricingModelCommand,
} from '@/model/pricing-model';

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

    let pricingModel = {} as BasePricingModelCommand | FreePricingModelCommand | FixedPricingModelCommand | FixedRowPricingModelCommand | FixedPopulationPricingModelCommand | CallPrePaidPricingModelCommand | CallBlockRatePricingModelCommand | RowPrePaidPricingModelCommand | RowBlockRatePricingModelCommand;
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
    if (pricingModel.type === EnumPricingModel.PER_CALL_WITH_PREPAID && (pricingModel as CallPrePaidPricingModelCommand).price < minPrice) {
      minPrice = (pricingModel as CallPrePaidPricingModelCommand).price;
      res.value = `${(pricingModel as CallPrePaidPricingModelCommand).price}`;
      res.suffix = 'per call';
    }
    if (pricingModel.type === EnumPricingModel.PER_CALL_WITH_BLOCK_RATE && (pricingModel as CallBlockRatePricingModelCommand).price < minPrice) {
      minPrice = (pricingModel as CallBlockRatePricingModelCommand).price;
      res.value = `${(pricingModel as CallBlockRatePricingModelCommand).price}`;
      res.suffix = 'per call';
    }
    if (pricingModel.type === EnumPricingModel.PER_ROW_WITH_PREPAID && (pricingModel as RowPrePaidPricingModelCommand).price < minPrice) {
      minPrice = (pricingModel as RowPrePaidPricingModelCommand).price;
      res.value = `${(pricingModel as RowPrePaidPricingModelCommand).price}`;
      res.suffix = 'per row';
    }
    if (pricingModel.type === EnumPricingModel.PER_ROW_WITH_BLOCK_RATE && (pricingModel as RowBlockRatePricingModelCommand).price < minPrice) {
      minPrice = (pricingModel as RowBlockRatePricingModelCommand).price;
      res.value = `${(pricingModel as RowBlockRatePricingModelCommand).price}`;
      res.suffix = 'per row';
    }
  }

  return res;
};

export default getPriceOrMinimumPrice;
