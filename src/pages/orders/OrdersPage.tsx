import axios from "axios";
import { useEffect, useState } from "react";
import { Header } from "../../components/Header";
import { OrdersGrid } from "./OrdersGrid";
import "./OrdersPage.css";

import type { CartItem, Order } from "../../types";

type OrdersPageProps = {
  cart: CartItem[];
  loadCart: () => Promise<void> | void;
};

export function OrdersPage({ cart, loadCart }: OrdersPageProps) {
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    const fetchOrders = async () => {
      const response = await axios.get<Order[]>("/api/orders?expand=products");
      setOrders(Array.isArray(response.data) ? response.data : []);
    };

    fetchOrders();
  }, []);

  return (
    <>
      <Header cart={cart} />

      <div className="orders-page">
        <div className="page-title">Your Orders</div>
        <OrdersGrid orders={orders} loadCart={loadCart} />
      </div>
    </>
  );
}
