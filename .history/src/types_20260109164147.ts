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

  // ✅ optional because cart.json does NOT include product
  product?: Product;
};

export type DeliveryOption = {
  id: string;
  deliveryDays: number; // ✅ matches deliveryOptions.json
  priceCents: number;
};
