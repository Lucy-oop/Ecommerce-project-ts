import axios from "axios";
import { Routes, Route } from "react-router-dom";
import { useEffect, useState } from "react";

import { HomePage } from "./pages/home/HomePage";
import { CheckoutPage } from "./pages/checkout/CheckoutPage";
import { OrdersPage } from "./pages/orders/OrdersPage";
import { TrackingPage } from "./pages/TrackingPage";
import { NotFoundPage } from "./pages/NotFoundPage";

import type { CartItem, Product } from "./types";
import "./App.css";

function App() {
  const [cart, setCart] = useState<CartItem[]>([]);

  const loadCart = async (): Promise<void> => {
    // 1) load cart.json
    const cartRes = await axios.get<CartItem[]>("/backend/cart.json");
    const rawCart = Array.isArray(cartRes.data) ? cartRes.data : [];

    // 2) load products.json
    const productsRes = await axios.get<Product[]>("/backend/products.json");
    const products = Array.isArray(productsRes.data) ? productsRes.data : [];

    const productMap = new Map(products.map((p) => [p.id, p]));

    // 3) merge product into cart items
    const merged: CartItem[] = rawCart.map((item) => ({
      ...item,
      product: productMap.get(item.productId),
    }));

    setCart(merged);
  };

  useEffect(() => {
    loadCart();
  }, []);

  return (
    <Routes>
      <Route index element={<HomePage cart={cart} loadCart={loadCart} />} />
      <Route path="checkout" element={<CheckoutPage cart={cart} loadCart={loadCart} />} />
      <Route path="orders" element={<OrdersPage cart={cart} loadCart={loadCart} />} />
      <Route path="tracking/:orderId/:productId" element={<TrackingPage cart={cart} />} />
      <Route path="*" element={<NotFoundPage cart={cart} />} />
    </Routes>
  );
}

export default App;



