// src/pages/checkout/DeliveryDate.tsx

import dayjs from "dayjs";
import type { CartItem, DeliveryOption } from "../../types";

/* ---------- Props ---------- */
interface DeliveryDateProps {
  cartItem: CartItem;
  deliveryOptions: DeliveryOption[];
}

/* ---------- Component ---------- */
export function DeliveryDate({
  cartItem,
  deliveryOptions,
}: DeliveryDateProps) {
  const selectedDeliveryOption = deliveryOptions.find(
    (option) => option.id === cartItem.deliveryOptionId
  );

  if (!selectedDeliveryOption) {
    return <div className="delivery-date">Delivery date: —</div>;
  }

  // Convert deliveryDays → estimated delivery date
  const estimatedDeliveryTimeMs = dayjs()
    .add(selectedDeliveryOption.deliveryDays, "day")
    .valueOf();

  return (
    <div className="delivery-date">
      Delivery date:{" "}
      {dayjs(estimatedDeliveryTimeMs).format("dddd, MMMM D")}
    </div>
  );
}
