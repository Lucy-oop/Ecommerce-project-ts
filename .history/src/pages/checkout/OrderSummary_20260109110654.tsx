import { DeliveryOptions, type DeliveryOption } from "./DeliveryOptions";
import { CartItemDetails, type CartItemDetailsCartItem } from "./CartItemDetails";
import { DeliveryDate } from "./DeliveryDate";

/* ---------- Types ---------- */
// If your CartItemDetails uses cartItem.product, we need product data included.
export interface OrderSummaryCartItem extends CartItemDetailsCartItem {
  deliveryOptionId: string;
}

interface OrderSummaryProps {
  cart: OrderSummaryCartItem[];
  deliveryOptions: DeliveryOption[];
  loadCart: () => Promise<void> | void;
}

export function OrderSummary({ cart, deliveryOptions, loadCart }: OrderSummaryProps) {
  return (
    <div className="order-summary">
      {deliveryOptions.length > 0 &&
        cart.map((cartItem) => {
          return (
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
          );
        })}
    </div>
  );
}

