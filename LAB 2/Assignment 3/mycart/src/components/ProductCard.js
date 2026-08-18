import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import './ProductCard.css';

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();

  // Generate ASCII stars based on rating
  const fullStars = Math.floor(product.rating || 0);
  const stars = "★".repeat(fullStars) + "☆".repeat(5 - fullStars);

  return (
    <div className="product-card glass">
      <Link to={`/product/${product.id}`} className="product-image-container">
        <img src={product.image} alt={product.name} className="product-image" />
        <div className="category-badge">{product.category}</div>
      </Link>
      <div className="product-info">
        <Link to={`/product/${product.id}`}>
          <h3 className="product-name">{product.name}</h3>
        </Link>
        
        <div className="product-amazon-meta">
          <div className="product-rating">
            <span className="stars">{stars}</span>
            <span className="review-count">{product.reviewCount}</span>
          </div>
          <div className={`product-stock ${product.inStock ? 'in-stock' : 'out-of-stock'}`}>
            {product.inStock ? 'IN STOCK' : 'OUT OF STOCK'}
          </div>
          {product.fastShip && <div className="product-prime">FAST SHIP</div>}
        </div>

        <div className="product-footer">
          <span className="product-price">${product.price.toFixed(2)}</span>
          <button 
            className="btn-primary add-to-cart"
            onClick={() => addToCart(product)}
            disabled={!product.inStock}
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
