import { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { CartContext } from '../context/CartContext';

export const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const { cart } = useContext(CartContext);
  const navigate = useNavigate();

  const cartItemCount = cart.reduce((total, item) => total + item.quantity, 0);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="border-b-4 border-ink bg-paper sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-6 py-4 flex flex-col md:flex-row justify-between items-center gap-4">
        <Link to="/" className="font-serif text-3xl font-bold tracking-tight uppercase flex items-center gap-2">
          <span className="text-rust">Field</span> Supply Co.
        </Link>
        
        <div className="flex items-center gap-8 font-mono text-sm uppercase tracking-widest">
          <Link to="/products" className="hover:text-rust transition-colors hover:underline underline-offset-4 decoration-2">Catalog</Link>
          <Link to="/cart" className="hover:text-rust transition-colors hover:underline underline-offset-4 decoration-2">
            Cart {cartItemCount > 0 && `(${cartItemCount})`}
          </Link>
          
          {user ? (
            <div className="flex items-center gap-4">
              <Link to="/orders" className="hover:text-rust transition-colors hover:underline underline-offset-4 decoration-2">Orders</Link>
              <button 
                onClick={handleLogout}
                className="text-rust hover:text-ink transition-colors hover:underline underline-offset-4 decoration-2"
              >
                Logout
              </button>
            </div>
          ) : (
            <Link to="/account" className="hover:text-rust transition-colors hover:underline underline-offset-4 decoration-2">Account</Link>
          )}
        </div>
      </div>
    </nav>
  );
};
