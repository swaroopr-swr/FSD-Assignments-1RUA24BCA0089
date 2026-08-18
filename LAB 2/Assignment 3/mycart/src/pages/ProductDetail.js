import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { products } from '../data/products';
import './ProductDetail.css';

const ProductDetail = () => {
  const { id } = useParams();
  const { addToCart } = useCart();
  const navigate = useNavigate();
  
  const product = products.find(p => p.id === parseInt(id));

  if (!product) {
    return (
      <div className="product-not-found">
        <h2>Product Not Found</h2>
        <Link to="/" className="btn-secondary">Back to Store</Link>
      </div>
    );
  }

  const fullStars = Math.floor(product.rating || 0);
  const stars = "★".repeat(fullStars) + "☆".repeat(5 - fullStars);

  const handleBuyNow = () => {
    addToCart(product);
    navigate('/checkout');
  };

  return (
    <>
      <Link to="/" className="back-link">← Back to Results</Link>
      <div className="product-detail-container">
        {/* Left Column: Image */}
        <div className="product-detail-image-wrapper">
          <img src={product.image} alt={product.name} className="product-detail-image" />
          <div className="product-detail-badge">{product.category}</div>
        </div>
        
        {/* Center Column: Info */}
        <div className="product-detail-info">
          <h1 className="product-detail-name">{product.name}</h1>
          <div className="product-detail-rating">
            <span className="stars">{stars}</span>
            <span className="review-count">{product.reviewCount} ratings</span>
          </div>
          
          <p className="product-detail-desc">{product.description}</p>
          
          <div className="product-detail-specs">
            <h3>About this item</h3>
            <ul>
              <li>Premium Brutalist Build</li>
              <li>100% Monochrome Aesthetic</li>
              <li>Sharp 90-degree corners</li>
              <li>No soft shadows</li>
            </ul>
          </div>
        </div>

        {/* Right Column: Amazon-style Buy Box */}
        <div className="product-buy-box glass">
          <div className="buy-box-price">${product.price.toFixed(2)}</div>
          
          {product.fastShip && (
            <div className="buy-box-prime">
              <strong>FAST SHIP</strong> FREE delivery tomorrow
            </div>
          )}
          
          <div className={`buy-box-stock ${product.inStock ? 'in-stock' : 'out-of-stock'}`}>
            {product.inStock ? 'In Stock.' : 'Currently unavailable.'}
          </div>

          {product.inStock && (
            <div className="buy-box-actions">
              <button 
                className="btn-primary buy-box-btn add-btn"
                onClick={() => addToCart(product)}
              >
                Add to Cart
              </button>
              <button 
                className="btn-secondary buy-box-btn buy-now-btn"
                onClick={handleBuyNow}
              >
                Buy Now
              </button>
            </div>
          )}

          <div className="buy-box-secure">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square" strokeLinejoin="miter">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
              <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
            </svg>
            Secure transaction
          </div>
        </div>
      </div>
    </>
  );
};

export default ProductDetail;
