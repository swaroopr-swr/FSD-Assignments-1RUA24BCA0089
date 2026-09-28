import React, { useState } from 'react';
import { categories } from '../../data/mockData';

const CategoryChips = () => {
  const [active, setActive] = useState('ALL');

  return (
    <div className="d-flex overflow-auto mb-4 pb-1" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
      {categories.map(cat => {
        const isActive = active === cat;
        return (
          <button
            key={cat}
            onClick={() => setActive(cat)}
            className="px-3 py-1 me-2 m-label rounded-pill border"
            style={{
              backgroundColor: isActive ? 'var(--m-ink)' : 'transparent',
              color: isActive ? 'var(--m-paper)' : 'var(--m-ink-soft)',
              borderColor: isActive ? 'var(--m-ink)' : 'var(--m-line)',
              whiteSpace: 'nowrap',
              transition: 'all 0.15s ease'
            }}
          >
            {cat}
          </button>
        );
      })}
    </div>
  );
};

export default CategoryChips;
