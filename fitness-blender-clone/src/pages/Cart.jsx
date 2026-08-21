import React from 'react';
import { ShoppingBag } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Cart() {
  return (
    <div className="bg-[#f4f7f8] min-h-[60vh] flex items-center justify-center">
      <div className="bg-white p-12 rounded-lg shadow-sm text-center max-w-md w-full m-4">
        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <ShoppingBag size={40} className="text-gray-400" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Your cart is empty</h1>
        <p className="text-gray-500 mb-8">Looks like you haven't added anything to your cart yet.</p>
        <Link to="/store" className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded inline-block w-full transition-colors">
          Start Shopping
        </Link>
      </div>
    </div>
  );
}