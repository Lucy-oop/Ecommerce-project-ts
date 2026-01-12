import dayjs from "dayjs";
import axios from "axios";
import { formatMoney } from "../../utlis/money";

/* ---------- Types ---------- */
export interface DeliveryOption {
  id: string;
  priceCents: number;
  estimatedDeliveryTimeMs: number;
}

export interface CartItem {
  productId: string;
  deliveryOptionId: string;
}

interface DeliveryOptionsProps {
  cartItem: CartItem;
  deliveryOptions: DeliveryOption[];
  loadCart: () => Promise<void> | void;
}

export function DeliveryOptions({
  cartItem,
  deliveryOptions,
  loadCart,
}: DeliveryOptionsProps) {
  const updateDeliveryOption = async (deliveryOptionId: string) => {
    await axios.put(`/api/cart-items/${cartItem.productId}`, {
      deliveryOptionId,
    });
    await loadCart();
  };

  return (
    <div className="delivery-options">
      <div className="delivery-options-title">Choose a delivery option:</div>

      {deliveryOptions.map((deliveryOption) => {
        const priceString =
          deliveryOption.priceCents > 0
            ? `${formatMoney(deliveryOption.priceCents)} - Shipping`
            : "FREE Shipping";

        const isChecked = deliveryOption.id === cartItem.deliveryOptionId;

        return (
          <div
            key={deliveryOption.id}
            className="delivery-option"
            onClick={() => updateDeliveryOption(deliveryOption.id)}
            data-testid="delivery-option"
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                updateDeliveryOption(deliveryOption.id);
              }
            }}
          >
            <input
              type="radio"
              checked={isChecked}
              onChange={() => updateDeliveryOption(deliveryOption.id)}
              className="delivery-option-input"
              name={`delivery-option-${cartItem.productId}`}
              data-testid="delivery-option-input"
            />

            <div>
              <div className="delivery-option-date">
                {dayjs(deliveryOption.estimatedDeliveryTimeMs).format(
                  "dddd, MMMM D"
                )}
              </div>
              <div className="delivery-option-price">{priceString}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
