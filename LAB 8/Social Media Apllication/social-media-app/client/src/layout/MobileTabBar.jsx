import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { currentUser } from '../data/mockData';

const MobileTabBar = () => {
  const navigate = useNavigate();

  const tabStyle = {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'var(--m-ink-soft)',
    textDecoration: 'none'
  };

  const activeStyle = {
    color: 'var(--m-rust)',
    borderBottom: '3px solid var(--m-rust)'
  };

  return (
    <div style={{
      position: 'fixed',
      bottom: 0,
      left: 0,
      right: 0,
      height: '64px',
      backgroundColor: 'var(--m-card)',
      borderTop: '1px solid var(--m-line)',
      display: 'flex',
      alignItems: 'stretch',
      paddingBottom: 'env(safe-area-inset-bottom)',
      zIndex: 1030
    }}>
      <NavLink to="/" style={({ isActive }) => isActive ? {...tabStyle, ...activeStyle} : tabStyle}>
        <i className="bi bi-house fs-4"></i>
      </NavLink>
      <NavLink to="/explore" style={({ isActive }) => isActive ? {...tabStyle, ...activeStyle} : tabStyle}>
        <i className="bi bi-compass fs-4"></i>
      </NavLink>
      
      {/* Create Post Center Button */}
      <div style={{ flex: 1, display: 'flex', justifyContent: 'center', position: 'relative' }}>
        <button 
          className="btn-stamp-primary"
          onClick={() => navigate('/create')}
          style={{
            position: 'absolute',
            top: '-20px',
            width: '56px',
            height: '56px',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: '2px solid var(--m-ink)',
            cursor: 'pointer',
            padding: 0
          }}
        >
          <i className="bi bi-plus-lg fs-3"></i>
        </button>
      </div>

      <NavLink to="/notifications" style={({ isActive }) => isActive ? {...tabStyle, ...activeStyle} : tabStyle}>
        <i className="bi bi-bell fs-4"></i>
      </NavLink>
      <NavLink to={`/profile/${currentUser.username}`} style={({ isActive }) => isActive ? {...tabStyle, ...activeStyle} : tabStyle}>
        <i className="bi bi-person fs-4"></i>
      </NavLink>
    </div>
  );
};

export default MobileTabBar;
