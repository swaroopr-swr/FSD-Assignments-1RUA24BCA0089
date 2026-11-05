import React from 'react';
import StatusBadge from './StatusBadge';
import { MapPin, Calendar, User, ArrowRight } from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function ItemCard({ item }) {
  const { setSelectedItemId } = useApp();

  const refCode = 'LF-' + (item._id ? item._id.slice(-6).toUpperCase() : '000000');
  const isFound = item.itemType === 'found';
  const borderTopColor = isFound ? 'var(--found-blue)' : 'var(--rust)';

  const formattedDate = item.date
    ? new Date(item.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
    : 'Date unrecorded';

  return (
    <article style={{
      backgroundColor: 'var(--bg-card)',
      border: '1px solid var(--line)',
      borderTop: `4px solid ${borderTopColor}`,
      borderRadius: '4px',
      padding: '20px',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
      transition: 'transform 0.15s ease, box-shadow 0.15s ease'
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.transform = 'translateY(-2px)';
      e.currentTarget.style.boxShadow = '0 6px 18px rgba(0,0,0,0.08)';
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.transform = 'translateY(0)';
      e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.04)';
    }}
    >
      <div>
        {/* Card Header: Case Code & Status Stamp */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
          <div>
            <span style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.75rem',
              color: isFound ? 'var(--found-blue)' : 'var(--rust)',
              fontWeight: 600,
              display: 'block'
            }}>
              {refCode} · {isFound ? 'FOUND PROPERTY' : 'LOST NOTICE'}
            </span>
            <h3 style={{
              fontFamily: 'var(--font-serif)',
              fontSize: '1.35rem',
              color: 'var(--ink)',
              margin: '2px 0 0',
              lineHeight: 1.2
            }}>
              {item.itemName}
            </h3>
          </div>
          <StatusBadge status={item.status} />
        </div>

        {/* Category Pill */}
        <div style={{ marginBottom: '12px' }}>
          <span style={{
            fontSize: '0.75rem',
            backgroundColor: 'var(--bg-soft)',
            padding: '2px 8px',
            borderRadius: '12px',
            color: 'var(--ink-soft)',
            border: '1px solid var(--line)'
          }}>
            {item.category}
          </span>
        </div>

        {/* Description Snippet */}
        <p style={{
          fontSize: '0.9rem',
          color: 'var(--ink-soft)',
          marginBottom: '16px',
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
          lineHeight: 1.5
        }}>
          {item.description}
        </p>

        {/* Metadata Badges */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '6px',
          fontSize: '0.8rem',
          color: 'var(--ink-soft)',
          borderTop: '1px dotted var(--line)',
          paddingTop: '12px',
          marginBottom: '16px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <MapPin size={14} color="var(--ink-muted)" />
            <span>{item.location || 'Campus Location'}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Calendar size={14} color="var(--ink-muted)" />
            <span>{isFound ? 'Discovered:' : 'Misplaced:'} {formattedDate}</span>
          </div>
          {item.reportedBy && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <User size={14} color="var(--ink-muted)" />
              <span>Lodged by: {item.reportedBy.fullName}</span>
            </div>
          )}
        </div>
      </div>

      {/* Action Trigger (Event: onClick) */}
      <button
        onClick={() => setSelectedItemId(item._id)}
        className="btn btn-secondary btn-sm"
        style={{ width: '100%', justifyContent: 'space-between' }}
      >
        <span>Inspect Case File</span>
        <ArrowRight size={14} />
      </button>
    </article>
  );
}
