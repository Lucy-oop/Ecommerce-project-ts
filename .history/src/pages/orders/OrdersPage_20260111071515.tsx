import axios from "axios";
import { useEffect, useState } from "react";
import { Header } from "../../components/Header";
import { OrdersGrid } from "./OrdersGrid";
import "./OrdersPage.css";

import type { CartItem, Order, Product } from "../../types";

type ExpandedOrderProduct = {
  productId: string;
  quantity: number;
  estimatedDeliveryTimeMs: number;
  product?: Product;
};

type ExpandedOrder = Omit<Order, "products"> & {
  products: ExpandedOrderProduct[];
};

type OrdersPageProps = {
  cart: CartItem[];
  loadCart: () => Promise<void> | void;
};

export function OrdersPage({ cart, loadCart }: OrdersPageProps) {
  const [orders, setOrders] = useState<ExpandedOrder[]>([]);

  useEffect(() => {
    const fetchOrders = async () => {
      const res = await axios.get<ExpandedOrder[]>("/api/orders?expand=products");
      setOrders(Array.isArray(res.data) ? res.data : []);
    };

    fetchOrders();
  }, []);

  return (
    <>
      <Header cart={cart} />

      <div className="orders-page">
        <div className="page-title">Your Orders</div>

        {/* ✅ IMPORTANT: pass loadCart */}
        <OrdersGrid orders={orders} loadCart={loadCart} />
      </div>
    </>
  );
}
