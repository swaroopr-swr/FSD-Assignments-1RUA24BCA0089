import React from 'react';
import './Header.css';

const Header = () => {
  return (
    <header className="navbar">
      <div className="nav-container">
        <div className="logo">
          <strong>stripe</strong>
        </div>
        
        <nav className="nav-links">
          <a href="#products">Products</a>
          <a href="#solutions">Solutions</a>
          <a href="#developers">Developers</a>
          <a href="#resources">Resources</a>
          <a href="#pricing">Pricing</a>
        </nav>
        
        <div className="nav-actions">
          <a href="#contact" className="contact-btn">Contact Sales</a>
          <a href="#signin" className="btn-primary">Sign in <span className="arrow">→</span></a>
        </div>
      </div>
    </header>
  );
};

export default Header;
