import axios from 'axios';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Header } from '../components/Header';
import './TrackingPage.css';

/* ---------- Types ---------- */

interface CartItem {
  productId: string;
  quantity: number;
}

interface TrackingPageProps {
  cart: CartItem[];
}

interface ProductInfo {
  name: string;
  image: string;
}

interface OrderProduct {
  productId: string;
  quantity: number;
  estimatedDeliveryTimeMs: number;
  product: ProductInfo;
}

interface Order {
  id: string;
  orderTimeMs: number;
  products: OrderProduct[];
}

/* ---------- Component ---------- */

export function TrackingPage({ cart }: TrackingPageProps) {
  const { orderId, productId } = useParams<{ orderId: string; productId: string }>();
  const [order, setOrder] = useState<Order | null>(null);

  useEffect(() => {
    if (!orderId) return;

    const fetchTrackingData = async () => {
      // ✅ fixed URL (no newline in template string)
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
        <title>Tracking</title>
        <link rel="icon" type="image/svg+xml" href="tracking-favicon.png" />
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
      <title>Tracking</title>
      <link rel="icon" type="image/svg+xml" href="tracking-favicon.png" />

      <Header cart={cart} />

      <div className="tracking-page">
        <div className="order-tracking">
          <Link className="back-to-orders-link link-primary" to="/orders">
            View all orders
          </Link>

          <div className="delivery-date">
            {deliveryPercent >= 100 ? 'Delivered on ' : 'Arriving on '}
            {dayjs(orderProduct.estimatedDeliveryTimeMs).format('dddd, MMMM D')}
          </div>

          <div className="product-info">{orderProduct.product.name}</div>

          <div className="product-info">Quantity: {orderProduct.quantity}</div>

          <img className="product-image" src={orderProduct.product.image} alt={orderProduct.product.name} />

          <div className="progress-labels-container">
            <div className={`progress-label ${isPreparing ? 'current-status' : ''}`}>
              Preparing
            </div>
            <div className={`progress-label ${isShipped ? 'current-status' : ''}`}>
              Shipped
            </div>
            <div className={`progress-label ${isDelivered ? 'current-status' : ''}`}>
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
