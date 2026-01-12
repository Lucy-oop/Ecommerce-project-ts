import { useState,type ChangeEvent } from 'react';
import { NavLink,useNavigate, useSearchParams } from 'react-router-dom';
import CartIcon from '../assets/images/icons/cart-icon.png';
import SearchIcon from '../assets/images/icons/search-icon.png';
import LogoWhite from '../assets/images/logo-white.png';
import MobileLogoWhite from '../assets/images/mobile-logo-white.png';
import './header.css';

type HeaderProps = {
  cart: Array<{ quantity: number }>; // ✅ only what Header needs
};


export function Header({ cart }: HeaderProps) {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const searchText = searchParams.get('search');
    const [search,setSearch] = useState(searchText || '');
    

    const updateSearchInput = (event : ChangeEvent<HTMLInputElement>) => {
        setSearch(event.target.value);
    };

    const searchProducts = () => {
        navigate(`/?search=${search}`);
        };


    let totalQuantity = 0;

    cart.forEach((cartItem) => {
        totalQuantity += cartItem.quantity;
    }); // to display cart quantity//$
    return (

        <div className="header">
            <div className="left-section">
                <NavLink to="/" className="header-link">
                    <img className="logo"
                    data-testid="header-logo"
                        src={LogoWhite} />
                    <img className="mobile-logo"
                    data-testid="header-mobile-logo"
                        src={MobileLogoWhite} />
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

                <button className="search-button" onClick={searchProducts} data-testid="header-search-button">
                    <img className="search-icon" src={SearchIcon} />
                </button>
            </div>

            <div className="right-section">
                <NavLink className="orders-link header-link" to="/orders" data-testid="header-orders-link">
                    <span className="orders-text">Orders</span>
                </NavLink>

                <NavLink className="cart-link header-link" to="/checkout" data-testid="header-cart-link">
                    <img className="cart-icon" src={CartIcon} />
                    <div className="cart-quantity">{totalQuantity}</div>
                    <div className="cart-text">Cart</div>
                </NavLink>
            </div>
        </div>
    );

}