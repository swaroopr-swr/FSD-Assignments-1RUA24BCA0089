import React from 'react';
import { useApp } from '../context/AppContext';
import { Package, CheckCircle2, AlertCircle, Clock } from 'lucide-react';

export default function StatBanner() {
  const { stats, setStatusFilter, setTypeFilter } = useApp();

  const cards = [
    {
      title: 'Discovered in Custody',
      count: stats.foundCount || 0,
      icon: <Package size={20} color="var(--found-blue)" />,
      badge: 'Available & Handed In',
      onClick: () => { setTypeFilter('found'); setStatusFilter('all'); }
    },
    {
      title: 'Reunited with Owner',
      count: stats.returnedCount || 0,
      icon: <CheckCircle2 size={20} color="var(--olive)" />,
      badge: 'Resolved Cases',
      onClick: () => { setTypeFilter('found'); setStatusFilter('Returned'); }
    },
    {
      title: 'Active Lost Reports',
      count: stats.lostCount || 0,
      icon: <AlertCircle size={20} color="var(--rust)" />,
      badge: 'Seeking Recovery',
      onClick: () => { setTypeFilter('lost'); setStatusFilter('all'); }
    },
    {
      title: 'Pending Claims',
      count: stats.pendingClaimsCount || 0,
      icon: <Clock size={20} color="var(--amber)" />,
      badge: 'Awaiting Decision',
      onClick: () => { setTypeFilter('found'); setStatusFilter('Available'); }
    }
  ];

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
      gap: '16px',
      margin: '24px 0'
    }}>
      {cards.map((card, idx) => (
        <div
          key={idx}
          onClick={card.onClick}
          style={{
            backgroundColor: 'var(--bg-card)',
            border: '1px solid var(--line)',
            borderRadius: '4px',
            padding: '16px 20px',
            cursor: 'pointer',
            transition: 'transform 0.15s ease, box-shadow 0.15s ease',
            boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.08)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.05)';
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--ink-soft)', fontWeight: 500 }}>
              {card.title}
            </span>
            {card.icon}
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--ink)', lineHeight: 1 }}>
            {card.count}
          </div>
          <div style={{ marginTop: '8px', fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: 'var(--ink-muted)' }}>
            {card.badge} &rarr;
          </div>
        </div>
      ))}
    </div>
  );
}
