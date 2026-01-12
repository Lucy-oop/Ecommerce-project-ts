import { OrderHeader } from './OrderHeader';
import { OrderDetailsGrid } from './OrderDetailsGrid';

interface Order {
  id: string;
  // add other fields if needed (shared with OrderHeader / OrderDetailsGrid)
  orderTimeMs?: number;
  totalCostCents?: number;
}

interface OrdersGridProps {
  orders: Order[];
  loadCart: () => void;
}

export function OrdersGrid({ orders, loadCart }: OrdersGridProps) {
  return (
    <div className="orders-grid">
      {orders.map((order) => (
        <div
          key={order.id}
          className="order-container"
          data-testid="order-container"
        >
          <OrderHeader order={order} />
          <OrderDetailsGrid order={order} />
        </div>
      ))}
    </div>
  );
}
