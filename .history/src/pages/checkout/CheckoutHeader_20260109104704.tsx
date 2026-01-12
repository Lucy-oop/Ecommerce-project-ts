import "./CheckoutHeader.css";
import { Link } from "react-router-dom";

import CheckoutLockIcon from "../../assets/images/icons/checkout-lock-icon.png";
import Logo from "../../assets/images/logo.png";
import MobileLogo from "../../assets/images/mobile-logo.png";

/* ---------- Types ---------- */

type CartItem = {
  productId: string;
  quantity: number;
};

type CheckoutHeaderProps = {
  cart: CartItem[];
};

/* ---------- Component ---------- */

export function CheckoutHeader({ cart }: CheckoutHeaderProps) {
  const totalQuantity = cart.reduce(
    (sum, cartItem) => sum + cartItem.quantity,
    0
  );

  return (
    <div className="checkout-header" data-testid="checkout-header">
      <div className="header-content">
        <div className="checkout-header-left-section">
          <Link to="/">
            <img className="logo" src={Logo} alt="Trinkora logo" />
            <img className="mobile-logo" src={MobileLogo} alt="Trinkora logo mobile" />
          </Link>
        </div>

        <div className="checkout-header-middle-section">
          Checkout (
          <Link className="return-to-home-link" to="/">
            {totalQuantity} items
          </Link>
          )
        </div>

        <div className="checkout-header-right-section">
          <img src={CheckoutLockIcon} alt="Secure checkout" />
        </div>
      </div>
    </div>
  );
}
