export type BusinessType = "retailer" | "wholesaler" | "distributor";

export type PackSizeKg = 5 | 10 | 26 | 50 | 75 | 100;

export interface BusinessTypeTerms {
  type: BusinessType;
  label: string;
  tagline: string;
  discountPercent: number;
  discountLabel: string;
  quantityLabel: string;
  paymentTerms: string;
  minimumOrderKg: number;
  availablePackSizes: PackSizeKg[];
}

export interface RegisteredFirm {
  businessType: BusinessType;
  registeredBusinessName: string;
  gstNo: string;
  tin: string;
  shopName: string;
  numberOfOutlets: number;
  representativeContact: string;
  mobile: string;
  email: string;
  deliveryPincode: string;
  password: string;
}

export interface Address {
  id: string;
  label: "Primary Business Address" | "Shipping Address" | "Billing Address" | string;
  contactPerson: string;
  mobile: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  district: string;
  state: string;
  pincode: string;
  landmark?: string;
  isDefault: boolean;
}

export interface BusinessProfile {
  registeredBusinessName: string;
  businessType: BusinessType;
  gstin: string;
  tin: string;
  shopName: string;
  numberOfOutlets: number;
  representativeContact: string;
  mobile: string;
  email: string;
  address: {
    address: string;
    city: string;
    district: string;
    state: string;
    pincode: string;
  };
}

export interface AuthenticatedUser {
  id: string;
  name: string;
  businessName: string;
  businessType: BusinessType;
  gstin: string;
  email: string;
}

export interface Product {
  id: string;
  name: string;
  variety: string;
  description: string;
  origin: string;
  tag: string;
  image: string;
  basePricePerKg: number;
  stockKg: number;
}

export interface PriceForPack {
  packSize: PackSizeKg;
  price: number;
  pricePerKg: number;
}

export interface OrderLineItem {
  productId: string;
  productName: string;
  packSize: PackSizeKg;
  quantity: number;
  unitPrice: number;
  total: number;
}

export type OrderStatus =
  | "processing"
  | "shipped"
  | "delivered"
  | "cancelled";

export type PaymentStatus = "paid" | "unpaid" | "partial";

export interface OrderTimelineStep {
  label: string;
  completed: boolean;
  timestamp?: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  date: string;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  items: OrderLineItem[];
  totalWeightKg: number;
  subtotal: number;
  discount: number;
  gst: number;
  freight: number;
  total: number;
  shippingAddressId: string;
  billingAddressId: string;
  timeline: OrderTimelineStep[];
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  orderId: string;
  orderNumber: string;
  date: string;
  dueDate: string;
  amount: number;
  paid: number;
  balance: number;
  status: "paid" | "unpaid" | "overdue" | "partial";
}
