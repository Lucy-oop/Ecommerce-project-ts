// src/pages/checkout/DeliveryOptions.tsx

import dayjs from "dayjs";
import axios from "axios";
import { formatMoney } from "../../utlis/money";
import type { CartItem, DeliveryOption } from "../../types";

type DeliveryOptionsProps = {
  cartItem: CartItem;
  deliveryOptions: DeliveryOption[];
  loadCart: () => Promise<void> | void;
};

export function DeliveryOptions({ cartItem, deliveryOptions, loadCart }: DeliveryOptionsProps) {
  const updateDeliveryOption = async (deliveryOptionId: string) => {
    await axios.put(`/api/cart-items/${cartItem.productId}`, {
      deliveryOptionId,
    });
    await loadCart();
  };

  return (
    <div className="delivery-options">
      <div className="delivery-options-title">Choose a delivery option:</div>

      {deliveryOptions.map((option) => {
        const priceString =
          option.priceCents === 0 ? "FREE Shipping" : `${formatMoney(option.priceCents)} - Shipping`;

        const dateString = dayjs().add(option.deliveryDays, "day").format("dddd, MMMM D");

        return (
          <div
            key={option.id}
            className="delivery-option"
            onClick={() => updateDeliveryOption(option.id)}
            data-testid="delivery-option"
          >
            <input
              type="radio"
              checked={option.id === cartItem.deliveryOptionId}
              onChange={() => {}}
              className="delivery-option-input"
              name={`delivery-option-${cartItem.productId}`}
              data-testid="delivery-option-input"
            />

            <div>
              <div className="delivery-option-date">{dateString}</div>
              <div className="delivery-option-price">{priceString}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
