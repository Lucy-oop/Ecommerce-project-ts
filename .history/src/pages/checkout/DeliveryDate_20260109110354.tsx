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
      deliveryOptions
}: DeliveryDateProps) {
      const selectedDeliveryOption = deliveryOptions.find(
            (deliveryOption) =>  deliveryOption.id === cartItem.deliveryOptionId
      );
      if (!slectedDeliveryOption){
            return null;
      }
          return (
          <div className="delivery-date">
                            Delivery date:{""} {dayjs(selectedDeliveryOption.estimatedDeliveryTimeMs).format('dddd, MMMM D')}
                 </div>

    );

}

