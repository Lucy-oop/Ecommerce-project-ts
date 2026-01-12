import axios from "axios";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Header } from "../components/Header";
import "./TrackingPage.css";

/* ---------- Types ---------- */

type CartItem = {
  productId: string;
  quantity: number;
  deliveryOptionId: string;
};

type TrackingPageProps = {
  cart: CartItem[];
};

type ProductInfo = {
  name: string;
  image: string;
};

type OrderProduct = {
  productId: string;
  quantity: number;
  estimatedDeliveryTimeMs: number;
  product: ProductInfo;
};

type Order = {
  id: string;
  orderTimeMs: number;
  products: OrderProduct[];
};

/* ---------- Component ---------- */

export function TrackingPage({ cart }: TrackingPageProps) {
  const { orderId, productId } = useParams<{ orderId: string; productId: string }>();
  const [order, setOrder] = useState<Order | null>(null);

  useEffect(() => {
    if (!orderId) return;

    const fetchTrackingData = async () => {
      const response = await axios.get<Order>(`/api/orders/${orderId}?expand=products`);
      setOrder(response.data);
    };

    fetchTrackingData();
  }, [orderId]);

  if (!order || !productId) {
    return null;
  }

  const orderProduct = order.products.find((p) => p.productId === productId);

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
            {deliveryPercent >= 100 ? "Delivered on " : "Arriving on "}
            {dayjs(orderProduct.estimatedDeliveryTimeMs).format("dddd, MMMM D")}
          </div>

          <div className="product-info">{orderProduct.product.name}</div>

          <div className="product-info">Quantity: {orderProduct.quantity}</div>

          <img
            className="product-image"
            src={orderProduct.product.image}
            alt={orderProduct.product.name}
          />

          <div className="progress-labels-container">
            <div className={`progress-label ${isPreparing ? "current-status" : ""}`}>
              Preparing
            </div>
            <div className={`progress-label ${isShipped ? "current-status" : ""}`}>
              Shipped
            </div>
            <div className={`progress-label ${isDelivered ? "current-status" : ""}`}>
              Delivered
            </div>
          </div>

          <div className="progress-bar-container">
            <div className="progress-bar" style={{ width: `${deliveryPercent}%` }} />
          </div>
        </div>
      </div>
    </>
  );
}

