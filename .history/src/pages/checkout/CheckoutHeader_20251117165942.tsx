import './CheckoutHeader.css'
import CheckoutLockIcon from '../../assets/images/icons/checkout-lock-icon.png';
import Logo from "../../assets/images/logo.png";
import MobileLogo from '../../assets/images/mobile-logo.png';
import { Link } from 'react-router-dom';

export function CheckoutHeader ({ cart }){

    let totalQuantity = 0;
    cart.forEach((cartItem) => {
        totalQuantity += cartItem.quantity;
    });

    return(
          <div className="checkout-header"
          data-testid="checkout-header">
                <div className="header-content">
                    <div className="checkout-header-left-section">
                        <Link to="/">
                            <img className="logo" src={Logo} />
                            <img className="mobile-logo" src={MobileLogo} />
                        </Link>
                    </div>

                    <div className="checkout-header-middle-section">
                        Checkout (<Link className="return-to-home-link"
                            to="/">{totalQuantity} items</Link>)
                    </div>

                    <div className="checkout-header-right-section">
                        <img src={CheckoutLockIcon} />
                    </div>
                </div>
            </div>

    );
}