import React from 'react';

const IconButton = ({ icon, onClick, ariaLabel, className = '', ...props }) => {
  return (
    <button 
      type="button"
      className={`icon-button ${className}`}
      onClick={onClick}
      aria-label={ariaLabel}
      {...props}
    >
      <i className={`bi ${icon} fs-5`}></i>
    </button>
  );
};

export default IconButton;
