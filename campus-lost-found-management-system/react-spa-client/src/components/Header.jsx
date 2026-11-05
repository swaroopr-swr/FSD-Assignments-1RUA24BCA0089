import React from 'react';
import { useApp } from '../context/AppContext';
import { Building2, PlusCircle, UserCheck, LayoutDashboard, Archive } from 'lucide-react';

export default function Header() {
  const {
    currentStudent,
    students,
    handleSwitchStudent,
    setIsReportModalOpen,
    activeTab,
    setActiveTab
  } = useApp();

  return (
    <header style={{
      backgroundColor: 'var(--ink)',
      color: '#fff',
      borderBottom: '4px solid var(--rust)',
      padding: '16px 0'
    }}>
      <div className="container" style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '16px'
      }}>
        {/* Brand Identity */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            background: 'var(--rust)',
            color: '#fff',
            width: '42px',
            height: '42px',
            borderRadius: '4px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Building2 size={24} />
          </div>
          <div>
            <div style={{
              fontFamily: 'var(--font-heading)',
              fontSize: '1.25rem',
              letterSpacing: '0.04em',
              fontWeight: 700,
              lineHeight: 1.2
            }}>
              Property Office Registry
            </div>
            <div style={{
              fontSize: '0.75rem',
              fontFamily: 'var(--font-mono)',
              color: 'var(--ink-muted)',
              letterSpacing: '0.05em'
            }}>
              COMPONENT 5 · MODULAR REACT SPA
            </div>
          </div>
        </div>

        {/* View Switcher Tabs */}
        <nav style={{ display: 'flex', gap: '8px' }}>
          <button
            onClick={() => setActiveTab('feed')}
            className="btn btn-sm"
            style={{
              backgroundColor: activeTab === 'feed' ? 'var(--rust)' : '#2a2f35',
              color: '#fff',
              border: 'none'
            }}
          >
            <Archive size={15} /> Property Ledger
          </button>
          <button
            onClick={() => setActiveTab('dashboard')}
            className="btn btn-sm"
            style={{
              backgroundColor: activeTab === 'dashboard' ? 'var(--rust)' : '#2a2f35',
              color: '#fff',
              border: 'none'
            }}
          >
            <LayoutDashboard size={15} /> Student Dashboard
          </button>
        </nav>

        {/* Actions & Student Identity Switcher */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
          {/* Active Identity Indicator & Quick Switcher */}
          <div style={{
            background: '#2a2f35',
            padding: '4px 10px',
            borderRadius: '4px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontSize: '0.85rem'
          }}>
            <UserCheck size={16} color="var(--olive-light)" />
            <span style={{ color: 'var(--ink-muted)' }}>Active Identity:</span>
            <select
              value={currentStudent?._id || ''}
              onChange={(e) => handleSwitchStudent(e.target.value)}
              style={{
                background: 'transparent',
                color: '#fff',
                border: 'none',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.85rem',
                outline: 'none',
                cursor: 'pointer'
              }}
            >
              {students.map((st) => (
                <option key={st._id} value={st._id} style={{ color: '#000' }}>
                  {st.fullName} ({st.usn || 'Verified'})
                </option>
              ))}
            </select>
          </div>

          {/* Lodge New Item Button */}
          <button
            onClick={() => setIsReportModalOpen(true)}
            className="btn btn-rust btn-sm"
            style={{ fontWeight: 600 }}
          >
            <PlusCircle size={16} /> Lodge Property Report
          </button>
        </div>
      </div>
    </header>
  );
}
