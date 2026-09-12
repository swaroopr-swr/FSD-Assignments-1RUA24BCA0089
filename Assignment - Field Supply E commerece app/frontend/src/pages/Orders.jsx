import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Navigate, Link } from 'react-router-dom';

export const Orders = () => {
  const { user, token } = useContext(AuthContext);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!token) return;

    const fetchOrders = async () => {
      try {
        const res = await fetch('http://localhost:5001/api/orders', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (!res.ok) throw new Error('Failed to fetch ledger.');
        
        const data = await res.json();
        // reverse to show newest first
        setOrders(data.reverse());
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [token]);

  if (!user) {
    return <Navigate to="/account" />;
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <h1 className="font-serif text-4xl uppercase tracking-widest font-bold mb-12">Requisition Ledger</h1>

      {loading && <p className="font-mono animate-pulse">Reading archives...</p>}
      
      {error && (
        <div className="border-2 border-rust p-6 bg-paper mb-8">
          <p className="font-mono text-rust">Error reading ledger: {error}</p>
        </div>
      )}

      {!loading && !error && orders.length === 0 && (
        <div className="border-2 border-ink p-12 text-center bg-cream">
          <p className="font-mono text-lg mb-6">No past requisitions found on record.</p>
          <Link to="/products" className="font-mono underline hover:text-rust">Return to Catalog</Link>
        </div>
      )}

      {!loading && !error && orders.length > 0 && (
        <div className="flex flex-col gap-8">
          {orders.map(order => (
            <div key={order.id} className="border-4 border-ink bg-paper p-6 relative">
              <div className="absolute top-0 right-0 bg-ink text-paper font-mono text-xs px-3 py-1 uppercase font-bold tracking-widest">
                Fulfilled
              </div>
              <div className="flex flex-col md:flex-row justify-between mb-6 pb-6 border-b-2 border-dashed border-ink border-opacity-30">
                <div>
                  <p className="font-mono text-sm uppercase opacity-70 mb-1">Docket No.</p>
                  <p className="font-mono text-lg font-bold">#{order.id}</p>
                </div>
                <div className="mt-4 md:mt-0 md:text-right">
                  <p className="font-mono text-sm uppercase opacity-70 mb-1">Date Logged</p>
                  <p className="font-mono">{new Date(order.date).toLocaleDateString()}</p>
                </div>
              </div>

              <div className="flex flex-col gap-3">
                {order.items.map(item => (
                  <div key={item.productId} className="flex justify-between font-mono text-sm">
                    <span>{item.quantity}x {item.name}</span>
                    <span>${(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>
              
              <div className="mt-6 pt-4 border-t-2 border-ink flex justify-between font-mono font-bold text-lg">
                <span>Total Authorized</span>
                <span>${order.total.toFixed(2)}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
