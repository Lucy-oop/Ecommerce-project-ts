// src/pages/TrackingPage.tsx
import axios from "axios";
import dayjs from "dayjs";
import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Header } from "../components/Header";
impo
import "./TrackingPage.css";

import type { CartItem, Order, Product } from "../types";

type TrackingPageProps = {
  cart: CartItem[];
};

export function TrackingPage({ cart }: TrackingPageProps) {
  const { orderId, productId } = useParams<{ orderId: string; productId: string }>();

  const [order, setOrder] = useState<Order | null>(null);
  const [allProducts, setAllProducts] = useState<Product[]>([]);

  // Fetch order (expanded)
  useEffect(() => {
    if (!orderId) return;

    const fetchOrder = async () => {
      const response = await axios.get<Order>(`/api/orders/${orderId}?expand=products`);
      setOrder(response.data);
    };

    fetchOrder();
  }, [orderId]);

  // Fetch products list (only used if orderProduct.product is missing)
  useEffect(() => {
    const fetchProducts = async () => {
      const res = await axios.get<Product[]>("/api/products");
      setAllProducts(Array.isArray(res.data) ? res.data : []);
    };

    fetchProducts();
  }, []);

  const orderProduct = useMemo(() => {
    if (!order || !productId) return undefined;
    return order.products.find((p) => p.productId === productId);
  }, [order, productId]);

  // If no order or no product in URL yet
  if (!order || !productId) return null;

  // If product not found in order
  if (!orderProduct) {
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

  // ✅ Get product info either from expanded orderProduct.product or from products list
  const productInfo =
    orderProduct.product ??
    allProducts.find((p) => p.id === orderProduct.productId);

  const totalDeliveryTimeMs = orderProduct.estimatedDeliveryTimeMs - order.orderTimeMs;
  const timePassedMs = dayjs().valueOf() - order.orderTimeMs;

  let deliveryPercent =
    totalDeliveryTimeMs <= 0 ? 100 : (timePassedMs / totalDeliveryTimeMs) * 100;

  if (deliveryPercent > 100) deliveryPercent = 100;
  if (deliveryPercent < 0) deliveryPercent = 0;

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
            {isDelivered ? "Delivered on " : "Arriving on "}
            {dayjs(orderProduct.estimatedDeliveryTimeMs).format("dddd, MMMM D")}
          </div>

          <div className="product-info">{productInfo?.name ?? "Product"}</div>

          <div className="product-info">Quantity: {orderProduct.quantity}</div>

          {productInfo?.image && (
            <img className="product-image" src={productInfo.image} alt={productInfo.name} />
          )}

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
