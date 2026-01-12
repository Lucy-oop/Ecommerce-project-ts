import axios from "axios";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Header } from "../components/Header";
import "./TrackingPage.css";

import type { CartItem, Order, Product } from "../types";

type TrackingPageProps = {
  cart: CartItem[];
};

type OrderWithProducts = Order & {
  products: Array<{
    productId: string;
    quantity: number;
    estimatedDeliveryTimeMs: number;
    product?: Product;
  }>;
};

export function TrackingPage({ cart }: TrackingPageProps) {
  const { orderId, productId } = useParams<{ orderId: string; productId: string }>();
  const [order, setOrder] = useState<OrderWithProducts | null>(null);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    if (!orderId) return;

    const run = async () => {
      try {
        const ordersRes = await axios.get<Order[]>("/backend/orders.json");
        const productsRes = await axios.get<Product[]>("/backend/products.json");

        const orders = Array.isArray(ordersRes.data) ? ordersRes.data : [];
        const products = Array.isArray(productsRes.data) ? productsRes.data : [];
        const productMap = new Map(products.map((p) => [p.id, p]));

        const found = orders.find((o) => o.id === orderId);
        if (!found) {
          setOrder(null);
          setError("Order not found.");
          return;
        }

        const merged: OrderWithProducts = {
          ...found,
          products: found.products.map((p) => ({
            ...p,
            product: productMap.get(p.productId),
          })),
        };

        setOrder(merged);
        setError("");
      } catch (e) {
        setError("Failed to load tracking data.");
        setOrder(null);
      }
    };

    run();
  }, [orderId]);

  if (error) {
    return (
      <>
        <Header cart={cart} />
        <div style={{ padding: 20 }}>{error}</div>
      </>
    );
  }

  if (!order || !productId) {
    return (
      <>
        <Header cart={cart} />
        <div style={{ padding: 20 }}>Loading…</div>
      </>
    );
  }

  const orderProduct = order.products.find((p) => p.productId === productId);

  if (!orderProduct || !orderProduct.product) {
    return (
      <>
        <Header cart={cart} />
        <div className="tracking-page">
          <div className="order-tracking">
            <Link className="back-to-orders-link link-primary" to="/orders">
              View all orders
            </Link>
            <div className="product-info">This product was not found in the order.</div>
          </div>
        </div>
      </>
    );
  }

  const totalDeliveryTimeMs = orderProduct.estimatedDeliveryTimeMs - order.orderTimeMs;
  const timePassedMs = dayjs().valueOf() - order.orderTimeMs;

  let deliveryPercent = totalDeliveryTimeMs <= 0 ? 100 : (timePassedMs / totalDeliveryTimeMs) * 100;
  deliveryPercent = Math.max(0, Math.min(100, deliveryPercent));

  const isPreparing = deliveryPercent < 33;
  const isShipped = deliveryPercent >= 33 && deliveryPercent < 100;
  const isDelivered = deliveryPercent === 100;

  return (
    <>
      <Header cart={cart} />

      <div className="tracking-page">
        <div className="order-tracking">
          <Link className="back-to-orders-link link-primary" to="/orders">
            View all orders
          </Link>

          <div className="delivery-date">
            {deliveryPercent >= 100 ? "Delivered on " : "Arriving on "}
            {dayjs(orderProduct.estimatedDeliveryTimeMs).format("dddd, MMMM D")}
          </div>

          <div className="product-info">{orderProduct.product.name}</div>
          <div className="product-info">Quantity: {orderProduct.quantity}</div>

          <img className="product-image" src={orderProduct.product.image} alt={orderProduct.product.name} />

          <div className="progress-labels-container">
            <div className={`progress-label ${isPreparing ? "current-status" : ""}`}>Preparing</div>
            <div className={`progress-label ${isShipped ? "current-status" : ""}`}>Shipped</div>
            <div className={`progress-label ${isDelivered ? "current-status" : ""}`}>Delivered</div>
          </div>

          <div className="progress-bar-container">
            <div className="progress-bar" style={{ width: `${deliveryPercent}%` }} />
          </div>
        </div>
      </div>
    </>
  );
}

