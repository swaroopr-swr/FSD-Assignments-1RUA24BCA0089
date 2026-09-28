import React from 'react';

const Tag = ({ text, className = '' }) => {
  return (
    <span 
      className={`px-2 py-1 rounded-pill ${className}`}
      style={{
        backgroundColor: 'var(--m-rust-tint)',
        color: 'var(--m-rust-dark)',
        fontFamily: 'var(--m-font-mono)',
        fontSize: '0.75rem',
        fontWeight: 700,
        letterSpacing: '0.06em',
        textTransform: 'uppercase'
      }}
    >
      #{text}
    </span>
  );
};

export default Tag;
