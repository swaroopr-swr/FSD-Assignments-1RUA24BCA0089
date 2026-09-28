import React from 'react';
import { useNavigate } from 'react-router-dom';
import StampButton from '../components/ui/StampButton';
import EmptyState from '../components/ui/EmptyState';

const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <div className="d-flex flex-column align-items-center justify-content-center pt-5 mt-5">
      <h1 style={{ fontFamily: 'var(--m-font-serif)', fontSize: '4rem', color: 'var(--m-rust)' }}>404</h1>
      <EmptyState message="PAGE NOT FOUND IN THIS JOURNAL" />
      <StampButton variant="primary" onClick={() => navigate('/')} className="mt-4">
        BACK TO HOME
      </StampButton>
    </div>
  );
};

export default NotFoundPage;
