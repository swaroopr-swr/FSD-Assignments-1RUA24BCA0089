import React from 'react';
import { useApp } from '../context/AppContext';
import { Search, Filter, RotateCcw } from 'lucide-react';

export default function FilterControls() {
  const {
    typeFilter,
    setTypeFilter,
    statusFilter,
    setStatusFilter,
    categoryFilter,
    setCategoryFilter,
    searchQuery,
    setSearchQuery,
    categories
  } = useApp();

  const resetFilters = () => {
    setTypeFilter('all');
    setStatusFilter('all');
    setCategoryFilter('all');
    setSearchQuery('');
  };

  const isFiltered = typeFilter !== 'all' || statusFilter !== 'all' || categoryFilter !== 'all' || searchQuery !== '';

  return (
    <div style={{
      backgroundColor: 'var(--bg-card)',
      border: '1px solid var(--line)',
      borderRadius: '4px',
      padding: '16px',
      marginBottom: '24px'
    }}>
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: '12px',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        {/* Live Search Input (Event: onChange, State: searchQuery) */}
        <div style={{ position: 'relative', flex: '1 1 300px' }}>
          <Search size={18} color="var(--ink-muted)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
          <input
            type="text"
            className="form-input"
            style={{ paddingLeft: '38px' }}
            placeholder="Search items by name, description, or location..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Category Dropdown (Event: onChange, State: categoryFilter) */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: '0 1 220px' }}>
          <Filter size={18} color="var(--ink-muted)" />
          <select
            className="form-select"
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
          >
            <option value="all">All Categories</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        {/* Reset Filter Action */}
        {isFiltered && (
          <button
            onClick={resetFilters}
            className="btn btn-secondary btn-sm"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
          >
            <RotateCcw size={14} /> Clear Filters
          </button>
        )}
      </div>

      {/* Type & Status Filter Buttons */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: '8px',
        marginTop: '16px',
        paddingTop: '12px',
        borderTop: '1px dashed var(--line)',
        alignItems: 'center'
      }}>
        <span style={{ fontSize: '0.8rem', fontFamily: 'var(--font-mono)', color: 'var(--ink-soft)', marginRight: '6px' }}>
          VIEW:
        </span>
        {[
          { label: 'All Property', value: 'all' },
          { label: 'Found Only', value: 'found' },
          { label: 'Lost Only', value: 'lost' }
        ].map((tab) => (
          <button
            key={tab.value}
            onClick={() => setTypeFilter(tab.value)}
            className="btn btn-sm"
            style={{
              backgroundColor: typeFilter === tab.value ? 'var(--ink)' : 'var(--bg-soft)',
              color: typeFilter === tab.value ? '#fff' : 'var(--ink)',
              border: '1px solid var(--line-strong)'
            }}
          >
            {tab.label}
          </button>
        ))}

        <span style={{ fontSize: '0.8rem', fontFamily: 'var(--font-mono)', color: 'var(--ink-soft)', marginLeft: '12px', marginRight: '6px' }}>
          STATUS:
        </span>
        {[
          { label: 'Any Status', value: 'all' },
          { label: 'Available', value: 'Available' },
          { label: 'Returned', value: 'Returned' },
          { label: 'Lost', value: 'Lost' }
        ].map((tab) => (
          <button
            key={tab.value}
            onClick={() => setStatusFilter(tab.value)}
            className="btn btn-sm"
            style={{
              backgroundColor: statusFilter === tab.value ? 'var(--found-blue)' : 'var(--bg-soft)',
              color: statusFilter === tab.value ? '#fff' : 'var(--ink)',
              border: '1px solid var(--line-strong)'
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>
    </div>
  );
}
