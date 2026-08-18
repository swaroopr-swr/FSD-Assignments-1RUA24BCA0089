import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useSearch } from '../context/SearchContext';
import './Navbar.css';

const CATEGORIES = ['All', 'Audio', 'Wearables', 'Computers', 'Tablets', 'Accessories'];

const Navbar = () => {
  const { cartCount } = useCart();
  const { searchTerm, setSearchTerm, activeCategory, setActiveCategory } = useSearch();
  const navigate = useNavigate();

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    navigate('/');
  };

  const handleCategoryClick = (category) => {
    setActiveCategory(category);
    navigate('/');
  };

  return (
    <header className="navbar-wrapper">
      <nav className="navbar main-navbar">
        <div className="navbar-container">
          <Link to="/" className="logo">
            <span className="logo-icon">▲</span>
            AURA
          </Link>

          <form className="search-form" onSubmit={handleSearchSubmit}>
            <input 
              type="text" 
              className="search-input" 
              placeholder="SEARCH PRODUCTS..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button type="submit" className="search-btn" aria-label="Search">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="square" strokeLinejoin="miter">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
            </button>
          </form>
          
          <div className="nav-actions">
            <Link to="/cart" className="cart-btn" aria-label="View Cart">
              <span className="cart-text">CART</span>
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                width="24" 
                height="24" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="square" 
                strokeLinejoin="miter"
              >
                <path d="M6 2L3 6v14h18V6l-3-4z"></path>
                <line x1="3" y1="6" x2="21" y2="6"></line>
                <path d="M16 10a4 4 0 0 1-8 0"></path>
              </svg>
              {cartCount > 0 && (
                <span className="cart-badge">{cartCount}</span>
              )}
            </Link>
          </div>
        </div>
      </nav>
      <div className="subnav">
        <div className="navbar-container subnav-container">
          {CATEGORIES.map(category => (
            <button 
              key={category} 
              className={`subnav-link ${activeCategory === category ? 'active' : ''}`}
              onClick={() => handleCategoryClick(category)}
            >
              {category}
            </button>
          ))}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
