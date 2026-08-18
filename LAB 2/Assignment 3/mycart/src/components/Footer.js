import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="amazon-footer">
      <div className="back-to-top" onClick={scrollToTop}>
        Back to top
      </div>
      
      <div className="footer-links-container">
        <div className="footer-column">
          <h3>Get to Know Us</h3>
          <ul>
            <li><Link to="#">Careers</Link></li>
            <li><Link to="#">About Us</Link></li>
            <li><Link to="#">Blog</Link></li>
            <li><Link to="#">Investor Relations</Link></li>
          </ul>
        </div>
        
        <div className="footer-column">
          <h3>Make Money with Us</h3>
          <ul>
            <li><Link to="#">Sell on Aura</Link></li>
            <li><Link to="#">Sell products</Link></li>
            <li><Link to="#">Become an Affiliate</Link></li>
            <li><Link to="#">Advertise Your Products</Link></li>
          </ul>
        </div>
        
        <div className="footer-column">
          <h3>Payment Products</h3>
          <ul>
            <li><Link to="#">Business Card</Link></li>
            <li><Link to="#">Shop with Points</Link></li>
            <li><Link to="#">Reload Your Balance</Link></li>
          </ul>
        </div>
        
        <div className="footer-column">
          <h3>Let Us Help You</h3>
          <ul>
            <li><Link to="#">Your Account</Link></li>
            <li><Link to="#">Your Orders</Link></li>
            <li><Link to="#">Shipping Rates</Link></li>
            <li><Link to="#">Returns & Replacements</Link></li>
            <li><Link to="#">Help</Link></li>
          </ul>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
