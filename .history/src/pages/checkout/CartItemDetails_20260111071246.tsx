// src/pages/checkout/CartItemDetails.tsx

import { formatMoney } from "../../utlis/money";
import { useState } from "react";
import axios from "axios";
import type { CartItem } from "../../types";
import {}

type CartItemDetailsProps = {
  cartItem: CartItem;
  loadCart: () => Promise<void> | void;
};

export function CartItemDetails({ cartItem, loadCart }: CartItemDetailsProps) {
  const [isUpdatingQuantity, setIsUpdatingQuantity] = useState(false);
  const [quantity, setQuantity] = useState<number>(cartItem.quantity);

  // ✅ product might be missing if cart came from /backend/cart.json
  if (!cartItem.product) {
    return <div>Loading product...</div>;
  }

  const deleteCartItem = async () => {
    await axios.delete(`/api/cart-items/${cartItem.productId}`);
    await loadCart();
  };

  const updateQuantity = async () => {
    if (isUpdatingQuantity) {
      await axios.put(`/api/cart-items/${cartItem.productId}`, {
        quantity: Number(quantity),
      });
      await loadCart();
      setIsUpdatingQuantity(false);
    } else {
      setIsUpdatingQuantity(true);
    }
  };

  return (
    <>
      <img className="product-image" src={`/${imagePathFromApi}`} alt={cartItem.product.name} />

      <div className="cart-item-details">
        <div className="product-name">{cartItem.product.name}</div>

        <div className="product-price" data-testid="cart-item-price">
          {formatMoney(cartItem.product.priceCents)}
        </div>

        <div className="product-quantity">
          <span data-testid="cart-item-quantity">
            Quantity:{" "}
            {isUpdatingQuantity ? (
              <input
                type="number"
                className="quantity-textbox"
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
              />
            ) : (
              <span className="quantity-label">{cartItem.quantity}</span>
            )}
          </span>

          <span className="update-quantity-link link-primary" onClick={updateQuantity}>
            Update
          </span>

          <span
            className="delete-quantity-link link-primary"
            data-testid="cart-item-delete-quantity-link"
            onClick={deleteCartItem}
          >
            Delete
          </span>
        </div>
      </div>
    </>
  );
}
