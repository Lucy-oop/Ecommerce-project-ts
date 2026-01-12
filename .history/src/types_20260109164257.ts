// src/types.ts

export type Product = {
  id: string;
  image: string;
  name: string;
  rating: {
    stars: number;
    count: number;
  };
  priceCents: number;
  keywords: string[];
};

export type CartItem = {
  productId: string;
  quantity: number;
  deliveryOptionId: string;
  product?: Product;
  
};

export type DeliveryOption = {
  id: string;
  deliveryDays: number;
  priceCents: number;
};

export type OrderProduct = {
  productId: string;
  quantity: number;
  estimatedDeliveryTimeMs: number; // orders.json already has this
};

export type Order = {
  id: string;
  orderTimeMs: number;
  totalCostCents: number;
  products: OrderProduct[];
};

// If you have /api/payment-summary in your project, define it.
// If you DON'T have payment-summary endpoint, you can ignore this type.
export type PaymentSummaryData = {
  totalItems: number;
  productCostCents: number;
  shippingCostCents: number;
  totalBeforeTaxCents: number;
  taxCents: number;
  totalCostCents: number;
};
