import React from 'react';
import { useSearch } from '../context/SearchContext';
import { products } from '../data/products';
import ProductCard from '../components/ProductCard';
import './Home.css';

const Home = () => {
  const { searchTerm, activeCategory } = useSearch();

  const filteredProducts = products.filter(product => {
    const matchesCategory = activeCategory === 'All' || product.category === activeCategory;
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          product.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <>
      <div className="hero-banner">
        <h2>BRUTAL DEALS</h2>
        <p>UP TO 50% OFF ALL AUDIO EQUIPMENTS</p>
      </div>
      
      <div className="results-info">
        {searchTerm && <h3>RESULTS FOR "{searchTerm.toUpperCase()}"</h3>}
        {!searchTerm && activeCategory !== 'All' && <h3>{activeCategory.toUpperCase()}</h3>}
      </div>

      <div className="product-grid">
        {filteredProducts.length > 0 ? (
          filteredProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))
        ) : (
          <div className="no-results">
            <h2>NO PRODUCTS FOUND.</h2>
            <p>TRY ANOTHER SEARCH OR CATEGORY.</p>
          </div>
        )}
      </div>
    </>
  );
};

export default Home;
