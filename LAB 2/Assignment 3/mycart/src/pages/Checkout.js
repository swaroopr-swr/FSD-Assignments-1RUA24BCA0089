import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import './Checkout.css';

const Checkout = () => {
  const { cartItems, cartTotal } = useCart();

  return (
    <div className="checkout-container">
      <header className="page-header">
        <h1 className="page-title">Checkout</h1>
        <p className="page-subtitle">Finalize your purchase</p>
      </header>

      <div className="checkout-content">
        <div className="checkout-form glass">
          <h2>Shipping Information</h2>
          <form onSubmit={(e) => e.preventDefault()}>
            <div className="form-group">
              <label>Full Name</label>
              <input type="text" placeholder="John Doe" required />
            </div>
            <div className="form-group">
              <label>Address</label>
              <input type="text" placeholder="123 Brutal St" required />
            </div>
            <div className="form-group row">
              <div className="half">
                <label>City</label>
                <input type="text" placeholder="Design City" required />
              </div>
              <div className="half">
                <label>Zip</label>
                <input type="text" placeholder="00000" required />
              </div>
            </div>
            <button className="btn-primary checkout-submit">Confirm Order</button>
          </form>
        </div>

        <div className="checkout-summary glass">
          <h2>Order Summary</h2>
          <div className="checkout-items">
            {cartItems.map(item => (
              <div key={item.id} className="checkout-item">
                <span>{item.quantity}x {item.name}</span>
                <span>${(item.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
          </div>
          <div className="checkout-total">
            <span>Total</span>
            <span>${cartTotal.toFixed(2)}</span>
          </div>
          <Link to="/" className="btn-secondary back-store-btn">Back to Store</Link>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
