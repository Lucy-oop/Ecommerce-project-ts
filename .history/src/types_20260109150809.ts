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

  // ✅ optional because /backend/cart.json does NOT include product
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
  estimatedDeliveryTimeMs: number;
  product?: Product; // optional if not expanded
};

export type Order = {
  id: string;
  orderTimeMs: number;
  totalCostCents: number;
  products: OrderProduct[];
};
