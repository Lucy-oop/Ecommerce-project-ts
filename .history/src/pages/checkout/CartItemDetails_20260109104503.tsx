// CartItemDetails.tsx
import { useState, type ChangeEvent, type KeyboardEvent } from "react";
import axios from "axios";
import { formatMoney } from "../../utils/money"; // ✅ fix: utlis -> utils

type Product = {
  id: string;
  name: string;
  image: string;
  priceCents: number;
};

type CartItem = {
  productId: string;
  quantity: number;
  product: Product;
};

type CartItemDetailsProps = {
  cartItem: CartItem;
  loadCart: () => Promise<void> | void;
};

export function CartItemDetails({ cartItem, loadCart }: CartItemDetailsProps) {
  const [isUpdatingQuantity, setIsUpdatingQuantity] = useState<boolean>(false);
  const [quantity, setQuantity] = useState<number>(cartItem.quantity);

  const deleteCartItem = async (): Promise<void> => {
    await axios.delete(`/api/cart-items/${cartItem.productId}`);
    await loadCart();
  };

  const updateQuantity = async (): Promise<void> => {
    if (!isUpdatingQuantity) {
      setIsUpdatingQuantity(true);
      return;
    }

    // ✅ fix: your URL was wrong. It must use real productId, not ":productId"
    await axios.put(`/api/cart-items/${cartItem.productId}`, {
      quantity: Number(quantity),
    });

    await loadCart();
    setIsUpdatingQuantity(false);
  };

  const updateQuantityInput = (event: ChangeEvent<HTMLInputElement>): void => {
    // allow empty input without crashing
    const val = event.target.value;
    setQuantity(val === "" ? 0 : Number(val));
  };

  const handleQuantityKeyDown = async (
    event: KeyboardEvent<HTMLInputElement>
  ): Promise<void> => {
    const keyPressed = event.key;

    if (keyPressed === "Enter") {
      await updateQuantity();
    } else if (keyPressed === "Escape") {
      setQuantity(cartItem.quantity);
      setIsUpdatingQuantity(false);
    }
  };

  return (
    <>
      <img
        className="product-image"
        src={cartItem.product.image}
        alt={cartItem.product.name}
        data-testid="cart-item-image"
      />

      <div className="cart-item-details">
        <div className="product-name" data-testid="cart-item-name">
          {cartItem.product.name}
        </div>

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
                onChange={updateQuantityInput}
                onKeyDown={handleQuantityKeyDown}
                min={0}
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
