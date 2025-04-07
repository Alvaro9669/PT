import React from 'react';
import './CartIcon.css';

const CartIcon = ({ isLoggedIn }) => {
    return (
        <div className="cart-icon-container">
            <img src="/images/shop_cart.svg" alt="Cart Icon" className="cart-icon" />
        </div>
    );
};

export default CartIcon;