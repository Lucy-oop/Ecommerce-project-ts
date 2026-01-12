import dayjs from "dayjs";


/* ---------- Types ---------- */
export interface DeliveryOption {
  id: string;
  estimatedDeliveryTimeMs: number;
}

export interface CartItem {
  deliveryOptionId: string;
}

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
    (deliveryOption) =>
      deliveryOption.id === cartItem.deliveryOptionId
  );

  if (!selectedDeliveryOption) {
    return null; // safety: prevents crash if data not loaded yet
  }

  return (
    <div className="delivery-date">
      Delivery date:{" "}
      {dayjs(selectedDeliveryOption.estimatedDeliveryTimeMs).format(
        "dddd, MMMM D"
      )}
    </div>
  );
}


