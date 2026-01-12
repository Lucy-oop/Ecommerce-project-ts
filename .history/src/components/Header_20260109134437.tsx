import { useState, type ChangeEvent } from "react";
import { NavLink, useNavigate, useSearchParams } from "react-router-dom";
import CartIcon from "../assets/images/icons/cart-icon.png";
import SearchIcon from "../assets/images/icons/search-icon.png";
import LogoWhite from "../assets/images/logo-white.png";
import MobileLogoWhite from "../assets/images/mobile-logo-white.png";
import "./header.css";

type HeaderProps = {
  cart: Array<{ quantity: number }> | unknown; // allow bad data safely
};

export function Header({ cart }: HeaderProps) {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const searchText = searchParams.get("search");
  const [search, setSearch] = useState(searchText || "");

  const updateSearchInput = (event: ChangeEvent<HTMLInputElement>) => {
    setSearch(event.target.value);
  };

  const searchProducts = () => {
    navigate(`/?search=${encodeURIComponent(search)}`);
  };

  // ✅ safe cart (prevents white screen)
  const safeCart = Array.isArray(cart) ? cart : [];

  // ✅ only ONE totalQuantity
  const totalQuantity = safeCart.reduce((sum, item) => sum + (item?.quantity ?? 0), 0);

  return (
    <div className="header">
      <div className="left-section">
        <NavLink to="/" className="header-link">
          <img className="logo" data-testid="header-logo" src={LogoWhite} alt="Logo" />
          <img
            className="mobile-logo"
            data-testid="header-mobile-logo"
            src={MobileLogoWhite}
            alt="Logo"
          />
        </NavLink>
      </div>

      <div className="middle-section">
        <input
          className="search-bar"
          type="text"
          placeholder="Search"
          value={search}
          onChange={updateSearchInput}
          data-testid="header-search-bar"
        />

        <button
          className="search-button"
          onClick={searchProducts}
          data-testid="header-search-button"
          type="button"
        >
          <img className="search-icon" src={SearchIcon} alt="Search" />
        </button>
      </div>

      <div className="right-section">
        <NavLink className="orders-link header-link" to="/orders" data-testid="header-orders-link">
          <span className="orders-text">Orders</span>
        </NavLink>

        <NavLink className="cart-link header-link" to="/checkout" data-testid="header-cart-link">
          <img className="cart-icon" src={CartIcon} alt="Cart" />
          <div className="cart-quantity">{totalQuantity}</div>
          <div className="cart-text">Cart</div>
        </NavLink>
      </div>
    </div>
  );
}
