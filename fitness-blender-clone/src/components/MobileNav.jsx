import React from 'react';
import { Search, ShoppingBag } from 'lucide-react';

const MobileNav = () => {
  // In a real implementation this would be toggled by the hamburger menu state
  // For now it's just the markup hidden by default
  return (
    <div className="hidden fixed inset-0 z-40 bg-white overflow-y-auto">
      <div className="pt-20 px-4">
        {/* Search */}
        <div className="mb-6 relative">
          <input 
            type="text" 
            placeholder="SEARCH" 
            className="w-full border-b-2 border-gray-200 py-3 pl-2 pr-10 focus:outline-none focus:border-blue-500 font-bold tracking-wide"
          />
          <Search className="absolute right-2 top-3 text-gray-400" size={20} />
        </div>

        {/* Links */}
        <div className="space-y-6 font-bold text-lg">
          <a href="/membership" className="block text-blue-600">Membership</a>
          
          <div className="space-y-3">
            <a href="/workouts" className="block text-gray-900">Workouts</a>
            <div className="pl-4 space-y-3 font-normal text-gray-600">
              <a href="/videos" className="block">Workout Videos</a>
              <a href="/custom" className="block">Custom Workouts</a>
            </div>
          </div>

          <div className="space-y-3">
            <a href="/programs" className="block text-gray-900">Programs</a>
          </div>

          <div className="space-y-3">
            <a href="/healthy-living" className="block text-gray-900">Healthy Living</a>
          </div>

          <div className="space-y-3">
            <a href="/community" className="block text-gray-900">Community</a>
          </div>

          <div className="space-y-3">
            <a href="/about" className="block text-gray-900">About</a>
          </div>

          <div className="space-y-3">
            <a href="/store" className="block text-gray-900">Store</a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MobileNav;
