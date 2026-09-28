import React from 'react';

const EmptyState = ({ message = 'NOTHING HERE YET' }) => {
  return (
    <div className="text-center py-5">
      <div className="mb-3">
        <i className="bi bi-inbox fs-1" style={{ color: 'var(--m-line)' }}></i>
      </div>
      <p className="m-label mb-0" style={{ color: 'var(--m-ink-soft)' }}>{message}</p>
    </div>
  );
};

export default EmptyState;
