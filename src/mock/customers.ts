import { BusinessTypeTerms, BusinessType } from "./types";
/** Static tier reference data — mirrors the seeded business_type_terms table. */

export const BUSINESS_TYPE_TERMS: Record<BusinessType, BusinessTypeTerms> = {
  retailer: {
    type: "retailer",
    label: "Retailer",
    tagline: "List price, small quantities, prepaid.",
    discountPercent: 0,
    discountLabel: "List Price",
    quantityLabel: "Small / retail quantities",
    paymentTerms: "Prepaid",
    minimumOrderKg: 50,
    availablePackSizes: [5, 10, 26],
  },
  wholesaler: {
    type: "wholesaler",
    label: "Wholesaler",
    tagline: "Sack quantities, credit that fits the market.",
    discountPercent: 6,
    discountLabel: "6% Off List",
    quantityLabel: "Market quantities",
    paymentTerms: "Net 15",
    minimumOrderKg: 250,
    availablePackSizes: [10, 26, 50],
  },
  distributor: {
    type: "distributor",
    label: "Distributor",
    tagline: "Territory volumes, extended settlement.",
    discountPercent: 12,
    discountLabel: "12% Off List",
    quantityLabel: "Territory volumes",
    paymentTerms: "Net 30",
    minimumOrderKg: 1000,
    availablePackSizes: [26, 50, 75, 100],
  },
};
