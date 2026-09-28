import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import StampButton from '../components/ui/StampButton';
import { currentUser } from '../data/mockData';

const SidebarNavItem = ({ to, icon, label, badge }) => {
  return (
    <OverlayTrigger
      placement="right"
      overlay={<Tooltip className="d-none d-md-block d-lg-none m-label">{label}</Tooltip>}
    >
      <NavLink 
        to={to} 
        className={({ isActive }) => 
          `d-flex align-items-center py-2 px-3 mb-2 rounded ${isActive ? 'active-nav' : ''}`
        }
        style={({ isActive }) => ({
          color: isActive ? 'var(--m-rust)' : 'var(--m-ink)',
          backgroundColor: isActive ? 'var(--m-rust-tint)' : 'transparent',
          borderLeft: isActive ? '3px solid var(--m-rust)' : '3px solid transparent',
          textDecoration: 'none',
          height: '44px'
        })}
      >
        <i className={`bi ${icon} fs-5`} style={{ width: '32px', textAlign: 'center' }}></i>
        <span className="m-label ms-2 d-md-none d-lg-inline" style={{ color: 'inherit', letterSpacing: '0.06em' }}>{label}</span>
        {badge && (
          <span className="badge ms-auto d-md-none d-lg-inline" style={{ backgroundColor: 'var(--m-rust)', color: '#fff', borderRadius: '12px' }}>
            {badge}
          </span>
        )}
      </NavLink>
    </OverlayTrigger>
  );
};

const LeftSidebar = () => {
  const navigate = useNavigate();
  return (
    <div className="d-flex flex-column h-100">
      <SidebarNavItem to="/" icon="bi-house" label="Home" />
      <SidebarNavItem to="/explore" icon="bi-compass" label="Explore" />
      <SidebarNavItem to="/notifications" icon="bi-bell" label="Notifications" badge="3" />
      <SidebarNavItem to="/messages" icon="bi-chat-dots" label="Messages" badge="2" />
      <SidebarNavItem to="/saved" icon="bi-bookmark" label="Saved Posts" />
      <SidebarNavItem to={`/profile/${currentUser.username}`} icon="bi-person" label="Profile" />
      <SidebarNavItem to="/settings" icon="bi-gear" label="Settings" />
      
      <div className="mt-4 px-2">
        <StampButton variant="primary" className="w-100 d-md-none d-lg-block" onClick={() => navigate('/create')}>
          NEW POST
        </StampButton>
        <StampButton variant="primary" className="w-100 d-none d-md-block d-lg-none" onClick={() => navigate('/create')}>
          <i className="bi bi-pencil-square"></i>
        </StampButton>
      </div>
    </div>
  );
};

export default LeftSidebar;
