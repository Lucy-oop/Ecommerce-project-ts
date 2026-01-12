// src/App.tsx
import axios from "axios";
import { Routes, Route } from "react-router-dom";
import { useEffect, useState } from "react";

import { HomePage } from "./pages/home/HomePage";
import { CheckoutPage } from "./pages/checkout/CheckoutPage";
import { OrdersPage } from "./pages/orders/OrdersPage";
import { TrackingPage } from "./pages/TrackingPage";
import { NotFoundPage } from "./pages/NotFoundPage";

import type { CartItem } from "./types";

import "./App.css";

function App() {
  const [cart, setCart] = useState<CartItem[]>([]);

  const loadCart = async (): Promise<void> => {
    const response = await axios.get<CartItem[]>("/backend/cart.json");
    setCart(Array.isArray(response.data) ? response.data : []);
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


