import axios from "axios";
import dayjs from "dayjs";
import { Fragment } from "react";
import { Link } from "react-router-dom";
import BuyAgainIcon from "../../assets/images/icons/buy-again.png";

import type { Order } from "../../types";

type OrderDetailsGridProps = {
  order: Order;
  loadCart: () => Promise<void> | void;
};

export function OrderDetailsGrid({ order, loadCart }: OrderDetailsGridProps) {
  return (
    <div className="order-details-grid">
      {order.products.map((orderProduct) => {
        const addToCart = async (): Promise<void> => {
          await axios.post("/api/cart-items", {
            productId: orderProduct.productId,
            quantity: 1,
          });

          await loadCart();
        };

        return (
          <Fragment key={orderProduct.productId}>
            <div className="product-image-container">
              {/* If your API doesn't expand product, this will be missing.
                  We'll handle that later if needed. */}
              <img
                src={(orderProduct as any).product?.image}
                alt={(orderProduct as any).product?.name ?? "Product"}
              />
            </div>

            <div className="product-details" data-testid="order-product-details">
              <div className="product-name">
                {(orderProduct as any).product?.name ?? orderProduct.productId}
              </div>

              <div className="product-delivery-date">
                Arriving on: {dayjs(orderProduct.estimatedDeliveryTimeMs).format("MMMM D")}
              </div>

              <div className="product-quantity">Quantity: {orderProduct.quantity}</div>

              <button className="buy-again-button button-primary" onClick={addToCart}>
                <img className="buy-again-icon" src={BuyAgainIcon} alt="Buy again" />
                <span className="buy-again-message">Add to Cart</span>
              </button>
            </div>

            <div className="product-actions">
              {/* ✅ FIX: tracking route needs BOTH orderId and productId */}
              <Link to={`/tracking/${order.id}/${orderProduct.productId}`}>
                <button className="track-package-button button-secondary">
                  Track package
                </button>
              </Link>
            </div>
          </Fragment>
        );
      })}
    </div>
  );
}
