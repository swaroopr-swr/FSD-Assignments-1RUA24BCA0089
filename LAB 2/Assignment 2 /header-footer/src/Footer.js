import React from 'react';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="site-footer">
      <div className="footer-container">
        
        <div className="footer-brand">
          <div className="logo-footer"><strong>stripe</strong></div>
          <p className="location-info">United States (English)</p>
          <p className="copyright">© 2024 Stripe, Inc.</p>
        </div>

        <div className="footer-column">
          <h4>Products</h4>
          <ul>
            <li><a href="#atlas">Atlas</a></li>
            <li><a href="#billing">Billing</a></li>
            <li><a href="#capital">Capital</a></li>
            <li><a href="#checkout">Checkout</a></li>
            <li><a href="#climate">Climate</a></li>
          </ul>
        </div>

        <div className="footer-column">
          <h4>Developers</h4>
          <ul>
            <li><a href="#doc">Documentation</a></li>
            <li><a href="#api">API reference</a></li>
            <li><a href="#status">API status</a></li>
            <li><a href="#changelog">API changelog</a></li>
          </ul>
        </div>

        <div className="footer-column">
          <h4>Company</h4>
          <ul>
            <li><a href="#about">About</a></li>
            <li><a href="#customers">Customers</a></li>
            <li><a href="#enterprise">Enterprise</a></li>
            <li><a href="#careers">Careers</a></li>
          </ul>
        </div>
        
      </div>
    </footer>
  );
};

export default Footer;
