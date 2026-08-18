import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { products } from '../data/products';
import ProductCard from '../components/ProductCard';
import './CartPage.css';

const CartPage = () => {
  const { cartItems, cartTotal, removeFromCart, updateQuantity } = useCart();
  const navigate = useNavigate();

  const handleProceed = () => {
    navigate('/checkout');
  };

  // Get some recommendations (just grab first 4 products not in cart)
  const cartIds = cartItems.map(item => item.id);
  const recommendations = products.filter(p => !cartIds.includes(p.id)).slice(0, 4);

  return (
    <div className="cart-page-container">
      <div className="cart-main-layout">
        
        {/* Left Column: Cart Items */}
        <div className="cart-items-section glass">
          <div className="cart-header-row">
            <h1>Shopping Cart</h1>
            <span className="price-label">Price</span>
          </div>
          
          {cartItems.length === 0 ? (
            <div className="cart-empty-msg">
              <h2>Your cart is empty.</h2>
              <Link to="/" className="btn-secondary">Continue Shopping</Link>
            </div>
          ) : (
            <div className="cart-items-list">
              {cartItems.map(item => {
                const fullStars = Math.floor(item.rating || 0);
                const stars = "★".repeat(fullStars) + "☆".repeat(5 - fullStars);

                return (
                  <div key={item.id} className="cart-item-row">
                    <div className="cart-item-image-container">
                      <Link to={`/product/${item.id}`}>
                        <img src={item.image} alt={item.name} className="cart-item-image" />
                      </Link>
                    </div>
                    
                    <div className="cart-item-details">
                      <Link to={`/product/${item.id}`} className="cart-item-title">
                        {item.name}
                      </Link>
                      
                      <div className="cart-item-rating">
                        <span className="stars">{stars}</span>
                        <span className="rating-val">{item.rating}</span>
                      </div>
                      
                      <div className={`cart-item-stock ${item.inStock ? 'in-stock' : 'out-of-stock'}`}>
                        {item.inStock ? 'In Stock' : 'Out of Stock'}
                      </div>
                      
                      <div className="cart-item-actions">
                        <div className="qty-controls">
                          <button 
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="qty-btn"
                          >
                            -
                          </button>
                          <span className="qty-val">{item.quantity}</span>
                          <button 
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="qty-btn"
                          >
                            +
                          </button>
                        </div>
                        <div className="action-links">
                          <button onClick={() => removeFromCart(item.id)} className="link-btn">Delete</button>
                          <span className="separator">|</span>
                          <button className="link-btn">Save for later</button>
                        </div>
                      </div>
                    </div>
                    
                    <div className="cart-item-price">
                      ${item.price.toFixed(2)}
                    </div>
                  </div>
                );
              })}
              
              <div className="cart-subtotal-row">
                Subtotal ({cartItems.reduce((acc, item) => acc + item.quantity, 0)} items): <strong>${cartTotal.toFixed(2)}</strong>
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Summary Box */}
        {cartItems.length > 0 && (
          <div className="cart-summary-section glass">
            <h2>Cart Summary</h2>
            <div className="summary-subtotal">
              Subtotal ({cartItems.reduce((acc, item) => acc + item.quantity, 0)} items): <strong>${cartTotal.toFixed(2)}</strong>
            </div>
            
            <label className="gift-checkbox">
              <input type="checkbox" />
              This order contains a gift
            </label>
            
            <button className="btn-primary proceed-btn" onClick={handleProceed}>
              Proceed to checkout
            </button>
            
            <div className="secure-tx">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square" strokeLinejoin="miter">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
              </svg>
              Secure transaction
            </div>
          </div>
        )}
      </div>

      {/* Recommendations Section */}
      <div className="recommendations-section glass">
        <h3>Customers who viewed items in your cart also viewed</h3>
        <div className="recommendations-grid">
          {recommendations.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default CartPage;
