import React, { useState } from 'react';

const Toggle = () => {
  // Boolean state for conditional rendering
  const [isVisible, setIsVisible] = useState(true);

  return (
    <div className="lab-component">
      <h3>Toggle Component</h3>
      <button className="btn-secondary" onClick={() => setIsVisible(!isVisible)}>
        {isVisible ? 'Hide Text' : 'Show Text'}
      </button>
      {/* Conditional rendering: only show paragraph if isVisible is true */}
      {isVisible && <p className="toggle-text">This text can be hidden and shown via state!</p>}
    </div>
  );
};

export default Toggle;
