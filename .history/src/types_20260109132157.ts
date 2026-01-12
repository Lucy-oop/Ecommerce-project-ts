export type Product = {
  id: string;
  name: string;
  image: string;
  priceCents: number;
  rating?: { stars: number; count: number };
  keywords?: string[];
};

export type CartItem = {
  productId: string;
  quantity: number;
  deliveryOptionId: string;
  product: Product; 
};


export type DeliveryOption = {
  id: string;
  priceCents: number;
  estimatedDeliveryTimeMs: number;
};

export type PaymentSummaryData = {
  totalItems: number;
  productCostCents: number;
  shippingCostCents: number;
  totalBeforeTaxCents: number;
  taxCents: number;
  totalCostCents: number;
};
