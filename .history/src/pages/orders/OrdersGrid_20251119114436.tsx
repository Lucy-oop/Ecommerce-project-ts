import { OrderHeader } from './OrderHeader';
import { OrderDetailsGrid } from './OrderDetailsGrid';


export function OrdersGrid({ orders,loadCart }) {
    return (
        <div className="orders-grid">
            {orders.map((order) => {
                return (
                    <div key={order.id} className="order-container" data-testid="order-container">

                        <OrderHeader order={order} />
                        <OrderDetailsGrid order={order} />
                    </div>

                );
            })}

        </div>

    )
}