import { DeliveryOptions } from "./DeliveryOptions";
import { CartItemDetails } from "./CartItemDetails";
import { DeliveryDate } from "./DeliveryDate";

import type { CartItem, DeliveryOption } from "../../types";

interface OrderSummaryProps {
  cart: CartItem[];
  deliveryOptions: DeliveryOption[];
  loadCart: () => Promise<void> | void;
}

export function OrderSummary({ cart, deliveryOptions, loadCart }: OrderSummaryProps) {
  return (
    <div className="order-summary">
      {deliveryOptions.length > 0 &&
        cart.map((cartItem) => (
          <div
            key={cartItem.productId}
            className="cart-item-container"
            data-testid="cart-item-container"
          >
            <DeliveryDate cartItem={cartItem} deliveryOptions={deliveryOptions} />

            <div className="cart-item-details-grid">
              <CartItemDetails cartItem={cartItem} loadCart={loadCart} />

              <DeliveryOptions
                cartItem={cartItem}
                deliveryOptions={deliveryOptions}
                loadCart={loadCart}
              />
            </div>
          </div>
        ))}
    </div>
  );
}

