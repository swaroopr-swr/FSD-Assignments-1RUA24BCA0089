import React from 'react';
import { Image } from 'react-bootstrap';

const Avatar = ({ src, name = 'User', size = 'md', className = '', hasDot = false }) => {
  const sizeMap = {
    sm: 32,
    md: 44,
    lg: 96,
    xl: 120
  };
  
  const dim = sizeMap[size] || sizeMap.md;
  const ringWidth = size === 'sm' ? '1.5px' : '2px';
  
  const getInitials = (str) => str.substring(0, 2).toUpperCase();

  const containerStyle = {
    width: dim,
    height: dim,
    borderRadius: '50%',
    border: `${ringWidth} solid var(--m-ink)`,
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: src ? 'transparent' : 'var(--m-ochre)',
    flexShrink: 0
  };

  const dotStyle = {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: size === 'sm' ? 8 : 12,
    height: size === 'sm' ? 8 : 12,
    backgroundColor: 'var(--m-moss)',
    borderRadius: '50%',
    border: '1.5px solid var(--m-card)'
  };

  return (
    <div style={containerStyle} className={className}>
      {src ? (
        <Image src={src} alt={name} roundedCircle style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
      ) : (
        <span style={{ fontFamily: 'var(--m-font-mono)', color: 'var(--m-ink)', fontWeight: 700, fontSize: dim * 0.4 }}>
          {getInitials(name)}
        </span>
      )}
      {hasDot && <div style={dotStyle} />}
    </div>
  );
};

export default Avatar;
