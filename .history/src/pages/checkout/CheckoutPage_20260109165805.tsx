import axios from "axios";
import { useEffect, useMemo, useState } from "react";

import { CheckoutHeader } from "./CheckoutHeader";
import { OrderSummary } from "./OrderSummary";
import { PaymentSummary } from "./PaymentSummary";
import "./CheckoutPage.css";

import type { CartItem, DeliveryOption, PaymentSummaryData } from "../../types";

type CheckoutPageProps = {
  cart: CartItem[];
  loadCart: () => Promise<void> | void;
};

export function CheckoutPage({ cart, loadCart }: CheckoutPageProps) {
  const [deliveryOptions, setDeliveryOptions] = useState<DeliveryOption[]>([]);

  useEffect(() => {
    const fetchDeliveryOptions = async () => {
      const res = await axios.get<DeliveryOption[]>("/backend/deliveryOptions.json");
      setDeliveryOptions(Array.isArray(res.data) ? res.data : []);
    };
    fetchDeliveryOptions();
  }, []);

  // ✅ compute payment summary from cart + deliveryOptions
  const paymentSummary: PaymentSummaryData | null = useMemo(() => {
    if (!Array.isArray(cart) || cart.length === 0) {
      return {
        totalItems: 0,
        productCostCents: 0,
        shippingCostCents: 0,
        totalBeforeTaxCents: 0,
        taxCents: 0,
        totalCostCents: 0,
      };
    }

    // if products not loaded yet, wait
    const hasMissingProduct = cart.some((c) => !c.product);
    if (hasMissingProduct) return null;

    const totalItems = cart.reduce((sum, c) => sum + c.quantity, 0);

    const productCostCents = cart.reduce(
      (sum, c) => sum + c.quantity * (c.product?.priceCents ?? 0),
      0
    );

    const shippingCostCents = cart.reduce((sum, c) => {
      const opt = deliveryOptions.find((d) => d.id === c.deliveryOptionId);
      return sum + (opt?.priceCents ?? 0);
    }, 0);

    const totalBeforeTaxCents = productCostCents + shippingCostCents;
    const taxCents = Math.round(totalBeforeTaxCents * 0.1);
    const totalCostCents = totalBeforeTaxCents + taxCents;

    return {
      totalItems,
      productCostCents,
      shippingCostCents,
      totalBeforeTaxCents,
      taxCents,
      totalCostCents,
    };
  }, [cart, deliveryOptions]);

  return (
    <>
      <CheckoutHeader cart={cart} />

      <div className="checkout-page">
        <div className="page-title">Review your order</div>

        <div className="checkout-grid">
          <OrderSummary cart={cart} deliveryOptions={deliveryOptions} loadCart={loadCart} />
          <PaymentSummary paymentSummary={paymentSummary} loadCart={loadCart} />
        </div>
      </div>
    </>
  );
}
