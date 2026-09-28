import React from 'react';
import { Button } from 'react-bootstrap';

const StampButton = ({ variant = 'primary', size = 'md', children, className = '', ...props }) => {
  const baseClass = `btn-stamp btn-stamp-${variant}`;
  const sizeClass = size === 'sm' ? 'btn-sm' : size === 'lg' ? 'btn-lg' : '';
  
  return (
    <Button variant="" className={`${baseClass} ${sizeClass} ${className}`} {...props}>
      {children}
    </Button>
  );
};

export default StampButton;
