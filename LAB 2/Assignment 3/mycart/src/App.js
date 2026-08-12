import React from 'react';
import { CartProvider } from './context/CartContext';
import Navbar from './components/Navbar';
import ProductList from './components/ProductList';
import Cart from './components/Cart';
import './App.css';

function App() {
  return (
    <CartProvider>
      <div className="app-container">
        <Navbar />
        
        <main className="main-content">
          <header className="page-header">
            <h1 className="page-title">Discover Premium Tech</h1>
            <p className="page-subtitle">Elevate your digital lifestyle with our curated collection.</p>
          </header>
          
          <ProductList />
        </main>
        
        <Cart />
      </div>
    </CartProvider>
  );
}

export default App;
