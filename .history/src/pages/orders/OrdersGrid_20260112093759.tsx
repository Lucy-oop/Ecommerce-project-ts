import { useEffect } from 'react';
import { OrderHeader } from './OrderHeader';
import { OrderDetailsGrid } from './OrderDetailsGrid';

type OrderFromHeader = React.ComponentProps<typeof OrderHeader>['order'];
type OrderFromDetails = React.ComponentProps<typeof OrderDetailsGrid>['order'];
type Order = OrderFromHeader & OrderFromDetails;

interface OrdersGridProps {
  orders: Order[];
  loadCart: () => void;
}

export function OrdersGrid({ orders, loadCart }: OrdersGridProps) {
  // uses loadCart so eslint stops complaining
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
          <OrderDetailsGrid order={order} />
        </div>
      ))}
    </div>
  );
}
