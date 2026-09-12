import { useState } from 'react';
import { useProducts } from '../hooks/useProducts';
import { ProductCard } from '../components/ProductCard';
import { TallyCheckbox } from '../components/TallyCheckbox';

export const Products = () => {
  const { products, loading, error, refetch } = useProducts();
  const [selectedCategories, setSelectedCategories] = useState([]);

  const categories = ['Notebooks', 'Instruments', 'Optics', 'Storage', 'Paper Goods'];

  const toggleCategory = (cat) => {
    setSelectedCategories(prev => 
      prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]
    );
  };

  const filteredProducts = products.filter(p => 
    selectedCategories.length === 0 || selectedCategories.includes(p.category)
  );

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      <div className="mb-12">
        <h1 className="font-serif text-4xl uppercase tracking-widest font-bold mb-4">Complete Catalog</h1>
        <p className="font-mono text-sm">Issue 4 - Fall/Winter</p>
      </div>

      <div className="flex flex-col md:flex-row gap-12">
        <aside className="w-full md:w-64 flex-shrink-0">
          <div className="border-2 border-ink p-6 sticky top-24">
            <h2 className="font-mono text-lg font-bold mb-6 border-b border-ink pb-2">Filter by Type</h2>
            <div className="flex flex-col gap-4">
              {categories.map(cat => (
                <TallyCheckbox 
                  key={cat}
                  label={cat}
                  checked={selectedCategories.includes(cat)}
                  onChange={() => toggleCategory(cat)}
                />
              ))}
            </div>
          </div>
        </aside>

        <main className="flex-1">
          {loading && <p className="font-mono animate-pulse">Loading catalog entries...</p>}
          
          {error && (
            <div className="border-2 border-rust p-6 bg-paper">
              <p className="font-mono text-rust mb-4">{error}</p>
              <button 
                onClick={refetch}
                className="font-mono underline text-ink hover:text-rust"
              >
                Retry Connection
              </button>
            </div>
          )}
          
          {!loading && !error && (
            <>
              <div className="mb-6 font-mono text-sm opacity-70">
                Showing {filteredProducts.length} items
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map(product => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  );
};
