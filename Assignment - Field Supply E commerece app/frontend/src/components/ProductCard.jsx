import { useState } from 'react';
import { Link } from 'react-router-dom';

export const ProductCard = ({ product }) => {
  const [imgError, setImgError] = useState(false);

  return (
    <div className="border-2 border-ink p-4 flex flex-col h-full bg-paper hover:shadow-[4px_4px_0px_0px_rgba(26,26,26,1)] transition-shadow duration-200 group">
      <div className="relative aspect-square bg-cream border-2 border-ink mb-4 flex items-center justify-center overflow-hidden">
        {!imgError ? (
          <img 
            src={product.imageUrl} 
            alt={product.name}
            className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="font-mono text-[10px] uppercase tracking-widest opacity-40">Image Unavailable</span>
          </div>
        )}
      </div>
      <div className="flex flex-col flex-grow">
        <span className="font-mono text-xs text-rust uppercase tracking-widest mb-2 border-b border-ink pb-1 inline-block w-fit">
          {product.category}
        </span>
        <h3 className="font-serif text-xl font-bold mb-2 flex-grow">{product.name}</h3>
        <div className="flex justify-between items-end mt-4">
          <span className="font-mono text-lg">${product.price.toFixed(2)}</span>
          <Link 
            to={`/products/${product.id}`}
            className="font-mono text-sm underline hover:text-rust transition-colors"
          >
            Examine &rarr;
          </Link>
        </div>
      </div>
    </div>
  );
};
