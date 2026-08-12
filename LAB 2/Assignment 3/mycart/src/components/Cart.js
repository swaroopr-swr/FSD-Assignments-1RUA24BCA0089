import React, { useEffect } from 'react';
import { useCart } from '../context/CartContext';
import CartItem from './CartItem';
import './Cart.css';

const Cart = () => {
  const { cartItems, cartTotal, isCartOpen, toggleCart } = useCart();

  // Close cart on escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isCartOpen) {
        toggleCart();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isCartOpen, toggleCart]);

  return (
    <>
      <div 
        className={`cart-overlay ${isCartOpen ? 'open' : ''}`} 
        onClick={toggleCart}
      />
      <div className={`cart-drawer glass ${isCartOpen ? 'open' : ''}`}>
        <div className="cart-header">
          <h2>Your Cart</h2>
          <button className="close-btn" onClick={toggleCart} aria-label="Close cart">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
        
        <div className="cart-body">
          {cartItems.length === 0 ? (
            <div className="empty-cart">
              <div className="empty-cart-icon">🛒</div>
              <p>Your cart is empty.</p>
              <button className="btn-secondary" onClick={toggleCart}>
                Continue Shopping
              </button>
            </div>
          ) : (
            <div className="cart-items">
              {cartItems.map(item => (
                <CartItem key={item.id} item={item} />
              ))}
            </div>
          )}
        </div>
        
        {cartItems.length > 0 && (
          <div className="cart-footer">
            <div className="cart-total-row">
              <span>Subtotal</span>
              <span className="cart-total-price">${cartTotal.toFixed(2)}</span>
            </div>
            <p className="cart-tax-note">Taxes and shipping calculated at checkout</p>
            <button className="btn-primary checkout-btn">
              Proceed to Checkout
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default Cart;
