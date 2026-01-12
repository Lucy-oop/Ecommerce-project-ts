import axios from "axios";
import dayjs from "dayjs";
import { Fragment, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

import BuyAgainIcon from "../../assets/images/icons/buy-again.png";
import { imagePathFromApi } from "../../utlis/image";
import type { Order, Product } from "../../types";

type OrderDetailsGridProps = {
  order: Order;
  loadCart: () => Promise<void> | void;
};

export function OrderDetailsGrid({ order, loadCart }: OrderDetailsGridProps) {
  const [allProducts, setAllProducts] = useState<Product[]>([]);

  // Fetch products once so we can map productId -> product info
  useEffect(() => {
    const fetchProducts = async () => {
      const res = await axios.get<Product[]>("/api/products");
      setAllProducts(Array.isArray(res.data) ? res.data : []);
    };

    fetchProducts();
  }, []);

  // quick lookup map
  const productById = useMemo(() => {
    const map = new Map<string, Product>();
    allProducts.forEach((p) => map.set(p.id, p));
    return map;
  }, [allProducts]);

  return (
    <div className="order-details-grid">
      {order.products.map((orderProduct) => {
        // If backend expands product, use it. Otherwise lookup from products list.
        const productInfo =
          (orderProduct as unknown as { product?: Product }).product ??
          productById.get(orderProduct.productId);

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
              {productInfo?.image ? (
                <img
                  src={imagePathFromApi(productInfo.image)}
                  alt={productInfo.name}
                />
              ) : (
                <div>No image</div>
              )}
            </div>

            <div className="product-details" data-testid="order-product-details">
              <div className="product-name">
                {productInfo?.name ?? orderProduct.productId}
              </div>

              <div className="product-delivery-date">
                Arriving on:{" "}
                {dayjs(orderProduct.estimatedDeliveryTimeMs).format("MMMM D")}
              </div>

              <div className="product-quantity">
                Quantity: {orderProduct.quantity}
              </div>

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
