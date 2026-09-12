import { useContext, useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';
import { useProducts } from '../hooks/useProducts';
import { CartLineItem } from '../components/CartLineItem';
import { StampButton } from '../components/StampButton';
import { DashedDivider } from '../components/FieldFormSection';

export const Cart = () => {
  const { cart, updateQuantity, removeItem, clearCart, getSubtotal } = useContext(CartContext);
  const { user, token } = useContext(AuthContext);
  const { products } = useProducts();
  const navigate = useNavigate();
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const subtotal = getSubtotal();

  // Clamp any item in cart that exceeds available stock
  useEffect(() => {
    cart.forEach(item => {
      const prod = products.find(p => p.id === item.productId);
      const availableStock = prod ? prod.stock : (typeof item.stock === 'number' ? item.stock : 50);
      if (item.quantity > availableStock && availableStock > 0) {
        updateQuantity(item.productId, availableStock, availableStock);
      }
    });
  }, [products]);

  const handleCheckout = async () => {
    if (!user) {
      navigate('/account');
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);
      
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5001'}/api/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ cart }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to place order.');
      }

      clearCart();
      navigate('/orders');
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-32 text-center">
        <div className="border-2 border-ink p-12 inline-block bg-paper">
          <h2 className="font-serif text-3xl mb-4">Your Requisition is Empty</h2>
          <p className="font-mono mb-8 opacity-70">No provisions have been selected for the field.</p>
          <Link to="/products">
            <StampButton variant="outline">Browse Catalog</StampButton>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-6 py-12">
      <h1 className="font-serif text-4xl uppercase tracking-widest font-bold mb-12">Requisition Form</h1>
      
      {error && (
        <div className="bg-rust text-cream p-4 mb-8 font-mono font-bold border-2 border-ink">
          [!] REQUISITION ERROR: {error}
        </div>
      )}

      <div className="flex flex-col lg:flex-row gap-12">
        <div className="lg:w-2/3">
          <div className="border-b-4 border-ink pb-2 mb-4 flex justify-between font-mono text-sm uppercase tracking-widest">
            <span>Item</span>
            <span className="hidden md:inline">Details</span>
          </div>
          
          <div className="flex flex-col">
            {cart.map(item => {
              const prod = products.find(p => p.id === item.productId);
              const availableStock = prod ? prod.stock : (typeof item.stock === 'number' ? item.stock : 50);
              return (
                <CartLineItem 
                  key={item.productId} 
                  item={item} 
                  stock={availableStock} 
                  onUpdate={updateQuantity} 
                  onRemove={removeItem} 
                />
              );
            })}
          </div>
        </div>
        
        <div className="lg:w-1/3">
          <div className="border-4 border-ink p-6 bg-cream sticky top-24">
            <h3 className="font-mono text-xl uppercase font-bold border-b-2 border-ink pb-4 mb-4">Summary</h3>
            
            <div className="flex justify-between font-mono mb-2">
              <span>Subtotal</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between font-mono mb-6 opacity-70">
              <span>Shipping</span>
              <span>Calculated later</span>
            </div>
            
            <div className="flex justify-between font-mono text-xl font-bold border-t-2 border-ink pt-4 mb-8">
              <span>Total</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            
            <DashedDivider />
            
            {!user ? (
              <div className="text-center">
                <p className="font-mono text-sm text-rust mb-4 font-bold">Authentication required to submit requisition.</p>
                <Link to="/account" state={{ from: '/cart' }}>
                  <StampButton className="w-full">Proceed to Login</StampButton>
                </Link>
              </div>
            ) : (
              <StampButton 
                onClick={handleCheckout} 
                disabled={isSubmitting}
                className="w-full"
              >
                {isSubmitting ? 'Submitting...' : 'Place Order'}
              </StampButton>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
