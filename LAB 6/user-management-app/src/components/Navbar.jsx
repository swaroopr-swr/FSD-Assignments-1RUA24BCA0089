import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="navbar-brand">
        {/* The brand logo/name links back to the home page */}
        <Link to="/">UserApp</Link>
      </div>
      <ul className="navbar-links">
        {/* 
          Using <Link> from react-router-dom instead of standard <a> tags 
          allows us to navigate without triggering a full page reload, 
          which makes the React app feel incredibly fast.
        */}
        <li><Link to="/">Home</Link></li>
        <li><Link to="/users">All Users</Link></li>
        <li><Link to="/users/even">Even Users</Link></li>
        <li><Link to="/users/odd">Odd Users</Link></li>
        <li><Link to="/api-users">API Users</Link></li>
        <li><Link to="/about">About</Link></li>
      </ul>
    </nav>
  );
};

export default Navbar;
