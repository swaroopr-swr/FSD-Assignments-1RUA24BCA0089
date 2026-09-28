import React from 'react';
import { Nav } from 'react-bootstrap';

const ProfileTabs = ({ activeTab, onSelect }) => {
  return (
    <Nav variant="tabs" className="mb-4" activeKey={activeTab} onSelect={onSelect}>
      <Nav.Item>
        <Nav.Link eventKey="posts">POSTS</Nav.Link>
      </Nav.Item>
      <Nav.Item>
        <Nav.Link eventKey="saved">SAVED</Nav.Link>
      </Nav.Item>
      <Nav.Item>
        <Nav.Link eventKey="liked">LIKED</Nav.Link>
      </Nav.Item>
    </Nav>
  );
};

export default ProfileTabs;
