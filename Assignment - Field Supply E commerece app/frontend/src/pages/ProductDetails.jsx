import { useState, useEffect, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import { QuantityStepper } from '../components/QuantityStepper';
import { StampButton } from '../components/StampButton';

export const ProductDetails = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [notFound, setNotFound] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  
  const [imgError, setImgError] = useState(false);
  
  const { cart, addItem } = useContext(CartContext);

  const inCartQty = product 
    ? (cart.find(item => item.productId === product.id)?.quantity || 0) 
    : 0;
  const remainingStock = product ? Math.max(0, product.stock - inCartQty) : 0;

  useEffect(() => {
    if (quantity > remainingStock && remainingStock > 0) {
      setQuantity(remainingStock);
    } else if (remainingStock === 0) {
      setQuantity(1);
    }
  }, [remainingStock]);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError(null);
        setNotFound(false);
        setImgError(false);
        const res = await fetch(`http://localhost:5001/api/products/${id}`);
        
        if (res.status === 404) {
          setNotFound(true);
          return;
        }
        
        if (!res.ok) {
          throw new Error('Failed to fetch product details.');
        }
        
        const data = await res.json();
        setProduct(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    if (product && remainingStock > 0) {
      addItem(product, quantity);
      setAdded(true);
      setTimeout(() => setAdded(false), 3000);
    }
  };

  if (loading) {
    return <div className="max-w-4xl mx-auto px-6 py-24 font-mono animate-pulse text-center">Consulting archives...</div>;
  }

  if (error) {
    return <div className="max-w-4xl mx-auto px-6 py-24 font-mono text-rust text-center">{error}</div>;
  }

  if (notFound || !product) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-32 text-center">
        <div className="border-4 border-ink p-12 bg-cream inline-block">
          <h2 className="font-serif text-4xl mb-6">Record Not Found</h2>
          <p className="font-mono text-lg mb-8">This item isn't in the catalog or has been permanently requisitioned.</p>
          <Link to="/products" className="font-mono underline hover:text-rust">Return to Catalog</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-6 py-12">
      <Link to="/products" className="font-mono text-sm underline hover:text-rust mb-8 inline-block">
        &larr; Back to Catalog
      </Link>
      
      <div className="flex flex-col md:flex-row gap-12">
        <div className="md:w-1/2">
           <div className="relative aspect-square bg-cream border-2 border-ink flex items-center justify-center overflow-hidden sticky top-24">
             {!imgError ? (
               <img 
                 src={product.imageUrl} 
                 alt={product.name}
                 className="absolute inset-0 w-full h-full object-cover"
                 onError={() => setImgError(true)}
               />
             ) : (
               <div className="absolute inset-0 flex items-center justify-center">
                 <span className="font-mono text-sm uppercase tracking-widest opacity-40">Image Unavailable</span>
               </div>
             )}
          </div>
        </div>
        
        <div className="md:w-1/2 flex flex-col">
          <div className="border-b-2 border-ink pb-6 mb-6">
            <span className="font-mono text-rust tracking-widest uppercase mb-4 inline-block">{product.category}</span>
            <h1 className="font-serif text-4xl lg:text-5xl font-bold mb-4">{product.name}</h1>
            <p className="font-mono text-3xl">${product.price.toFixed(2)}</p>
          </div>
          
          <div className="font-serif text-lg leading-relaxed mb-8 flex-grow">
            <p>{product.description}</p>
          </div>
          
          <div className="bg-paper border-2 border-ink p-6">
            <div className="flex items-center justify-between mb-6">
              <span className="font-mono uppercase font-bold">Status:</span>
              <span className={`font-mono ${product.stock > 0 ? (remainingStock === 0 ? 'text-rust' : 'text-ink') : 'text-rust'}`}>
                {product.stock <= 0 
                  ? 'Out of Stock' 
                  : remainingStock === 0 
                    ? `Limit Reached (${inCartQty} in cart)` 
                    : `${remainingStock} of ${product.totalStock || product.stock} Available${inCartQty > 0 ? ` (${inCartQty} in cart)` : ''}`}
              </span>
            </div>
            
            {product.stock > 0 && remainingStock > 0 ? (
              <div className="flex flex-col gap-6">
                <div className="flex items-center gap-4">
                  <span className="font-mono uppercase font-bold">Qty:</span>
                  <QuantityStepper 
                    quantity={quantity} 
                    max={remainingStock} 
                    onChange={setQuantity} 
                  />
                </div>
                
                <StampButton onClick={handleAddToCart} disabled={added} className="w-full">
                  {added ? 'Added to Requisition' : 'Add to Requisition'}
                </StampButton>
              </div>
            ) : product.stock > 0 && remainingStock === 0 ? (
              <div className="flex flex-col gap-3">
                <p className="font-mono text-sm text-rust">
                  Maximum available units ({product.stock}) are currently in your requisition.
                </p>
                <Link to="/cart">
                  <StampButton variant="outline" className="w-full">View Requisition</StampButton>
                </Link>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
};
