import React, { useState } from 'react';

const Counter = () => {
  // useState hook to manage the counter value
  const [count, setCount] = useState(0);

  return (
    <div className="lab-component">
      <h3>Counter Component</h3>
      <p>Current Count: <strong>{count}</strong></p>
      <div className="button-group">
        <button className="btn-primary" onClick={() => setCount(count + 1)}>Increment</button>
        <button className="btn-danger" onClick={() => setCount(count - 1)}>Decrement</button>
        <button className="btn-secondary" onClick={() => setCount(0)}>Reset</button>
      </div>
    </div>
  );
};

export default Counter;
