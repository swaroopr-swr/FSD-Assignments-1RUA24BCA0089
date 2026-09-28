import React from 'react';
import { Navbar, Nav, Container, Dropdown } from 'react-bootstrap';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import IconButton from '../components/ui/IconButton';
import Avatar from '../components/ui/Avatar';
import { currentUser } from '../data/mockData';

const TopNavbar = ({ onOpenMenu }) => {
  const navigate = useNavigate();

  return (
    <Navbar sticky="top" style={{ height: 'var(--m-navbar-h)', backgroundColor: 'var(--m-card)', borderBottom: '1px solid var(--m-line)', zIndex: 1030 }}>
      <Container style={{ maxWidth: '1320px' }}>
        
        {/* Mobile Hamburger */}
        <div className="d-md-none">
          <IconButton icon="bi-list" onClick={onOpenMenu} ariaLabel="Open Menu" />
        </div>

        {/* Brand */}
        <Navbar.Brand as={Link} to="/" className="d-flex align-items-center mx-auto mx-md-0">
          <div style={{ width: 32, height: 32, backgroundColor: 'var(--m-rust)', borderRadius: 8, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--m-font-serif)', fontWeight: 700, fontSize: '1.2rem', marginRight: '8px' }}>
            M
          </div>
          <span style={{ fontFamily: 'var(--m-font-serif)', fontWeight: 700, fontSize: '1.4rem', color: 'var(--m-ink)' }}>
            Margin
          </span>
        </Navbar.Brand>

        {/* Desktop Links */}
        <Nav className="d-none d-md-flex align-items-center m-auto">
          <Nav.Link as={NavLink} to="/" className="m-label px-3" style={{ color: 'var(--m-ink-soft)' }}>Home</Nav.Link>
          <Nav.Link as={NavLink} to="/explore" className="m-label px-3" style={{ color: 'var(--m-ink-soft)' }}>Explore</Nav.Link>
          <Nav.Link as={NavLink} to="/create" className="m-label px-3" style={{ color: 'var(--m-ink-soft)' }}>Create Post</Nav.Link>
          <Nav.Link as={NavLink} to={`/profile/${currentUser.username}`} className="m-label px-3" style={{ color: 'var(--m-ink-soft)' }}>Profile</Nav.Link>
        </Nav>

        {/* Right Actions */}
        <div className="d-flex align-items-center">
          <div className="position-relative me-3">
            <IconButton icon="bi-bell" ariaLabel="Notifications" onClick={() => navigate('/notifications')} />
            <div style={{ position: 'absolute', top: 8, right: 8, width: 8, height: 8, backgroundColor: 'var(--m-rust)', borderRadius: '50%' }}></div>
          </div>
          
          <Dropdown align="end" className="d-none d-md-block">
            <Dropdown.Toggle as="div" style={{ cursor: 'pointer' }} bsPrefix="p-0 border-0 bg-transparent">
              <Avatar src={currentUser.avatarUrl} name={currentUser.displayName} size="sm" />
            </Dropdown.Toggle>
            <Dropdown.Menu className="mt-2">
              <Dropdown.Item as={Link} to={`/profile/${currentUser.username}`} className="m-label"><i className="bi bi-person me-2"></i>Profile</Dropdown.Item>
              <Dropdown.Item as={Link} to="/saved" className="m-label"><i className="bi bi-bookmark me-2"></i>Saved</Dropdown.Item>
              <Dropdown.Item as={Link} to="/settings" className="m-label"><i className="bi bi-gear me-2"></i>Settings</Dropdown.Item>
              <Dropdown.Divider />
              <Dropdown.Item className="m-label text-danger"><i className="bi bi-box-arrow-right me-2"></i>Log out</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </div>

      </Container>
    </Navbar>
  );
};

export default TopNavbar;
