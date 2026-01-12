import { useEffect } from "react";
import { OrderHeader } from "./OrderHeader";
import { OrderDetailsGrid } from "./OrderDetailsGrid";

type OrderFromHeader = React.ComponentProps<typeof OrderHeader>["order"];
type OrderFromDetails = React.ComponentProps<typeof OrderDetailsGrid>["order"];
type Order = OrderFromHeader & OrderFromDetails;

interface OrdersGridProps {
  orders: Order[];
  loadCart: () => Promise<void> | void;
}

export function OrdersGrid({ orders, loadCart }: OrdersGridProps) {
  // Optional: you actually don't need this useEffect
  // but keeping it won't break anything
  useEffect(() => {
    loadCart();
  }, [loadCart]);

  return (
    <div className="orders-grid">
      {orders.map((order) => (
        <div
          key={order.id}
          className="order-container"
          data-testid="order-container"
        >
          <OrderHeader order={order} />

          {/* ✅ PASS loadCart HERE */}
          <OrderDetailsGrid order={order} loadCart={loadCart} />
        </div>
      ))}
    </div>
  );
}
