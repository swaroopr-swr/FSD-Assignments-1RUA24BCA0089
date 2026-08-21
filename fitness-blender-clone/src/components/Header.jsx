import React from 'react';
import { Search, ShoppingBag, Menu, User, ChevronDown } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

const Header = () => {
  const location = useLocation();

  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm font-sans border-b border-gray-100">
      <div className="max-w-[1440px] mx-auto px-4 lg:px-8">
        <div className="flex justify-between items-center h-[85px]">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center mr-8">
            <Link to="/" className="flex items-center gap-2">
              <svg viewBox="0 0 100 100" className="w-10 h-10" xmlns="http://www.w3.org/2000/svg">
                <circle cx="50" cy="50" r="45" fill="none" stroke="#0070c9" strokeWidth="10" />
                <path d="M40 30 L40 70 L70 50 Z" fill="#0070c9" />
                <path d="M50 5 A45 45 0 0 1 95 50" fill="none" stroke="#1d2c3c" strokeWidth="10" />
              </svg>
              <div className="flex flex-col leading-none">
                <span className="font-extrabold text-[1.4rem] tracking-tighter text-[#1d2c3c] uppercase" style={{ fontFamily: "'Montserrat', sans-serif" }}>FITNESS</span>
                <span className="font-light text-[0.8rem] tracking-[0.2em] text-[#1d2c3c] uppercase" style={{ fontFamily: "'Montserrat', sans-serif" }}>BLENDER</span>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-6 flex-1">
            <NavItem label="Workouts" to="/videos" hasDropdown active={location.pathname === '/videos'} />
            <NavItem label="Programs" to="/programs-challenges" hasDropdown active={location.pathname === '/programs-challenges'} />
            <NavItem label={<span>Healthy<br/>Living</span>} to="/healthy-living" hasDropdown active={location.pathname === '/healthy-living'} />
            <NavItem label="Community" to="/community" hasDropdown active={location.pathname === '/community'} />
            <NavItem label="About" to="/page/about-fitness-blender" hasDropdown active={location.pathname === '/page/about-fitness-blender'} />
            <Link to="/store" className="text-[#3a4a58] hover:text-[#0070c9] font-bold text-sm tracking-wide py-2">Store</Link>
            <Link to="/membership" className="text-[#0070c9] font-bold text-sm tracking-wide py-2">Membership</Link>
          </nav>

          {/* User & Utils */}
          <div className="flex items-center space-x-6 ml-auto">
            <div className="hidden lg:flex items-center space-x-2 cursor-pointer group">
              <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center group-hover:bg-gray-200 transition-colors text-gray-500">
                <User size={20} />
              </div>
              <div className="flex flex-col text-sm justify-center leading-tight">
                <span className="text-[#0070c9] text-xs font-semibold">Hi! Sign In</span>
                <span className="font-bold flex items-center text-[#3a4a58] group-hover:text-[#0070c9] transition-colors text-sm">
                  My Fitness <ChevronDown size={14} className="ml-1 text-gray-400" />
                </span>
              </div>
            </div>

            <button className="text-gray-700 hover:text-[#0070c9] transition-colors">
              <Search size={22} strokeWidth={2.5} />
            </button>
            <Link to="/store/cart" className="text-gray-700 hover:text-[#0070c9] relative transition-colors">
              <ShoppingBag size={22} strokeWidth={2.5} />
            </Link>
            
            {/* Mobile Menu Button */}
            <button className="lg:hidden text-gray-700">
              <Menu size={28} />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

const NavItem = ({ label, to, hasDropdown, active }) => (
  <div className="relative group flex items-center h-[85px] cursor-pointer">
    <Link to={to} className={`font-bold text-[0.9rem] flex items-center transition-colors leading-tight ${active ? 'text-[#0070c9]' : 'text-[#3a4a58] group-hover:text-[#0070c9]'}`}>
      {label}
      {hasDropdown && <ChevronDown size={16} className="ml-1 text-gray-400" />}
    </Link>
    {(active) ? (
      <div className="absolute bottom-[-1px] left-0 w-full h-[3px] bg-[#4db2db]" />
    ) : (
      <div className="absolute bottom-[-1px] left-0 w-full h-[3px] bg-[#4db2db] scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
    )}
  </div>
);

export default Header;
