import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import { SearchProvider } from './context/SearchContext';
import ScrollToTop from './components/ScrollToTop';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import ProductDetail from './pages/ProductDetail';
import Checkout from './pages/Checkout';
import CartPage from './pages/CartPage';
import './App.css';

function App() {
  return (
    <Router>
      <ScrollToTop />
      <CartProvider>
        <SearchProvider>
          <div className="app-container">
            <Navbar />
            
            <main className="main-content">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/product/:id" element={<ProductDetail />} />
                <Route path="/checkout" element={<Checkout />} />
                <Route path="/cart" element={<CartPage />} />
              </Routes>
            </main>
            
            <Footer />
          </div>
        </SearchProvider>
      </CartProvider>
    </Router>
  );
}

export default App;
