import React from 'react';
import { Offcanvas, ListGroup } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import Avatar from '../components/ui/Avatar';
import { currentUser } from '../data/mockData';

const MobileMenu = ({ show, onHide }) => {
  return (
    <Offcanvas show={show} onHide={onHide} placement="start" style={{ width: '280px' }}>
      <Offcanvas.Header closeButton className="border-bottom border-light">
        <Offcanvas.Title className="d-flex align-items-center">
          <Avatar src={currentUser.avatarUrl} name={currentUser.displayName} size="sm" className="me-2" />
          <span style={{ fontFamily: 'var(--m-font-serif)', fontWeight: 700 }}>{currentUser.displayName}</span>
        </Offcanvas.Title>
      </Offcanvas.Header>
      <Offcanvas.Body className="p-0">
        <ListGroup variant="flush">
          <ListGroup.Item as={Link} to={`/profile/${currentUser.username}`} onClick={onHide} className="border-0 py-3 m-label text-decoration-none">
            <i className="bi bi-person me-3 fs-5"></i> Profile
          </ListGroup.Item>
          <ListGroup.Item as={Link} to="/saved" onClick={onHide} className="border-0 py-3 m-label text-decoration-none">
            <i className="bi bi-bookmark me-3 fs-5"></i> Saved Posts
          </ListGroup.Item>
          <ListGroup.Item as={Link} to="/messages" onClick={onHide} className="border-0 py-3 m-label text-decoration-none d-flex align-items-center">
            <i className="bi bi-chat-dots me-3 fs-5"></i> Messages
            <span className="badge ms-auto" style={{ backgroundColor: 'var(--m-rust)', color: '#fff', borderRadius: '12px' }}>2</span>
          </ListGroup.Item>
          <ListGroup.Item as={Link} to="/settings" onClick={onHide} className="border-0 py-3 m-label text-decoration-none">
            <i className="bi bi-gear me-3 fs-5"></i> Settings
          </ListGroup.Item>
          <ListGroup.Item as="button" onClick={onHide} className="border-0 py-3 m-label text-danger text-start">
            <i className="bi bi-box-arrow-right me-3 fs-5"></i> Log Out
          </ListGroup.Item>
        </ListGroup>
      </Offcanvas.Body>
    </Offcanvas>
  );
};

export default MobileMenu;
