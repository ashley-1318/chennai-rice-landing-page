import { BusinessType, PackSizeKg, PriceForPack, Product } from "./types";
import { BUSINESS_TYPE_TERMS } from "./customers";

export const ALL_PACK_SIZES: PackSizeKg[] = [5, 10, 26, 50, 75, 100];

/** Pack sizes carry a small per-kg discount as size increases, layered on top of the business-type discount. */
const PACK_SIZE_EFFICIENCY: Record<PackSizeKg, number> = {
  5: 1,
  10: 0.985,
  26: 0.97,
  50: 0.955,
  75: 0.945,
  100: 0.935,
};

export function getPackSizesForBusinessType(businessType: BusinessType): PackSizeKg[] {
  return BUSINESS_TYPE_TERMS[businessType].availablePackSizes;
}

export function getPriceForPack(
  product: Product,
  packSize: PackSizeKg,
  businessType: BusinessType
): PriceForPack {
  const { discountPercent } = BUSINESS_TYPE_TERMS[businessType];
  const efficiency = PACK_SIZE_EFFICIENCY[packSize];
  const discountMultiplier = 1 - discountPercent / 100;
  const pricePerKg = Math.round(product.basePricePerKg * efficiency * discountMultiplier * 100) / 100;
  const price = Math.round(pricePerKg * packSize * 100) / 100;
  return { packSize, price, pricePerKg };
}

export function getPricesForProduct(product: Product, businessType: BusinessType): PriceForPack[] {
  return getPackSizesForBusinessType(businessType).map((packSize) =>
    getPriceForPack(product, packSize, businessType)
  );
}

export function getFullPriceListForProduct(product: Product, businessType: BusinessType): Record<PackSizeKg, PriceForPack | null> {
  const applicable = new Set(getPackSizesForBusinessType(businessType));
  const result = {} as Record<PackSizeKg, PriceForPack | null>;
  ALL_PACK_SIZES.forEach((size) => {
    result[size] = applicable.has(size) ? getPriceForPack(product, size, businessType) : null;
  });
  return result;
}

export const GST_RATE = 0.05;
export const FREIGHT_FLAT = 450;
export const FREIGHT_FREE_THRESHOLD_KG = 1000;
