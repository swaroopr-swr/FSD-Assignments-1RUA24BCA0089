import React from 'react';
import { Card } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import Avatar from '../ui/Avatar';
import StampButton from '../ui/StampButton';
import { currentUser } from '../../data/mockData';

const ComposerBar = () => {
  const navigate = useNavigate();

  return (
    <Card className="mb-4" style={{ cursor: 'text' }} onClick={() => navigate('/create')}>
      <Card.Body className="p-3 d-flex align-items-center">
        <Avatar src={currentUser.avatarUrl} name={currentUser.displayName} size="md" className="me-3" />
        <div className="flex-grow-1" style={{ color: 'var(--m-ink-soft)', fontFamily: 'var(--m-font-mono)', fontSize: '0.85rem' }}>
          What's on your mind?
        </div>
        <StampButton variant="ghost" className="ms-2">
          <i className="bi bi-image me-2"></i>PHOTO
        </StampButton>
      </Card.Body>
    </Card>
  );
};

export default ComposerBar;
