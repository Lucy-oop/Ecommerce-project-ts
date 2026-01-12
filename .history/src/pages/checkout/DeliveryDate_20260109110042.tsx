import dayjs from 'dayjs';
export interface DeliveryOption{
      id:string;
      esimatedDeliveryTimeMs: number;
}
export interface CartItem{
      deliveryOptionId: string;
}
interface DeliveryDateProps {
      cartItem:CartItem;
      deliveryOptions: DeliveryOption[];
}
export function DeliveryDate({
      cartItem,
      deliveryOptions,
}:)

export function DeliveryDate({ cartItem,deliveryOptions }){

      const selectedDeliveryOption = deliveryOptions.
      find((deliveryOption) => {
        return deliveryOption.id === cartItem.deliveryOptionId;
                });

    return (
          <div className="delivery-date">
                            Delivery date: {dayjs(selectedDeliveryOption.estimatedDeliveryTimeMs).format('dddd, MMMM D')}
                 </div>

    );
}