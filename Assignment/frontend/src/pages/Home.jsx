import { Link } from 'react-router-dom';
import { useProducts } from '../hooks/useProducts';
import { ProductCard } from '../components/ProductCard';
import { StampButton } from '../components/StampButton';

export const Home = () => {
  const { products, loading, error } = useProducts();

  const featured = products.slice(0, 3);

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      <section className="mb-24 text-center max-w-3xl mx-auto border-4 border-ink p-12 bg-cream">
        <h1 className="font-serif text-5xl md:text-6xl font-bold uppercase tracking-tight mb-6">
          Equipping the <br/><span className="text-rust italic">Analog Explorer</span>
        </h1>
        <p className="font-serif text-xl leading-relaxed mb-10">
          Curated instruments, resilient paper goods, and dependable optics for documenting your observations in the field. Leave the digital noise behind.
        </p>
        <Link to="/products">
          <StampButton>View Requisition Catalog</StampButton>
        </Link>
      </section>

      <section>
        <div className="flex items-center gap-4 mb-10">
          <h2 className="font-mono text-xl uppercase tracking-widest text-ink font-bold">Featured Provisions</h2>
          <div className="flex-1 border-t-2 border-dashed border-ink opacity-30"></div>
        </div>

        {loading && <p className="font-mono text-center py-12 animate-pulse">Consulting the ledger...</p>}
        {error && <p className="font-mono text-rust text-center py-12">Error retrieving provisions: {error}</p>}
        
        {!loading && !error && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featured.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
};
