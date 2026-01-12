import axios from "axios";
import dayjs from "dayjs";
import { Fragment } from "react";
import { Link } from "react-router-dom";
import BuyAgainIcon from "../../assets/images/icons/buy-again.png";

import type { Order, Product } from "../../types";
import { imagePathFromApi } from "../../utlis/image";

type ExpandedOrderProduct = {
  productId: string;
  quantity: number;
  estimatedDeliveryTimeMs: number;
  product?: Product; // optional (in case backend doesn't expand)
};

type ExpandedOrder = Omit<Order, "products"> & {
  products: ExpandedOrderProduct[];
};

type OrderDetailsGridProps = {
  order: ExpandedOrder;
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

        const name = orderProduct.product?.name ?? orderProduct.productId;
        const img = orderProduct.product?.image;

        return (
          <Fragment key={orderProduct.productId}>
            <div className="product-image-container">
              {img ? (
                <img src={imagePathFromApi(img)} alt={name} />
              ) : (
                <div style={{ padding: 8 }}>No image</div>
              )}
            </div>

            <div className="product-details" data-testid="order-product-details">
              <div className="product-name">{name}</div>

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
