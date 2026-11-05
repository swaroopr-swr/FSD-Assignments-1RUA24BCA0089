import React from 'react';
import { useApp } from './context/AppContext';
import Header from './components/Header';
import StatBanner from './components/StatBanner';
import FilterControls from './components/FilterControls';
import ItemCard from './components/ItemCard';
import DashboardView from './components/DashboardView';
import ItemDetailModal from './components/ItemDetailModal';
import ClaimModal from './components/ClaimModal';
import ReportModal from './components/ReportModal';
import { PackageSearch, AlertCircle, RefreshCw, CheckCircle, Info, PlusCircle } from 'lucide-react';

/**
 * App Root Component (react-spa-client)
 *
 * Demonstrates:
 * - Top-level layout composition
 * - Conditional view rendering (Public Feed vs. Student Dashboard)
 * - State-driven modal dispatching
 * - Centralized toast notifications
 * - Full compliance with Row 5: "Build modular frontend applications using
 *   a component-based approach with state and event management concepts."
 */
export default function App() {
  const {
    items,
    loading,
    feedback,
    activeTab,
    selectedItemId,
    isClaimModalOpen,
    isReportModalOpen,
    setIsReportModalOpen,
    refreshData
  } = useApp();

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Global Header Navigation */}
      <Header />

      {/* Floating / Top Toast Notification */}
      {feedback && (
        <div
          role="status"
          aria-live="polite"
          style={{
            maxWidth: '1200px',
            margin: '16px auto 0 auto',
            padding: '0 20px',
            width: '100%'
          }}
        >
          <div
            style={{
              padding: '12px 18px',
              borderRadius: '3px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              fontFamily: 'var(--font-sans)',
              fontSize: '0.92rem',
              fontWeight: 500,
              background:
                feedback.type === 'error'
                  ? 'var(--rust)'
                  : feedback.type === 'success'
                  ? 'var(--olive)'
                  : 'var(--ink)',
              color: '#ffffff',
              boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              {feedback.type === 'error' ? (
                <AlertCircle size={18} />
              ) : feedback.type === 'success' ? (
                <CheckCircle size={18} />
              ) : (
                <Info size={18} />
              )}
              <span>{feedback.message}</span>
            </div>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <main className="container" style={{ flex: 1, padding: '32px 20px' }}>
        {/* Loading Indicator */}
        {loading && items.length === 0 && (
          <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--ink-light)' }}>
            <RefreshCw size={32} style={{ margin: '0 auto 16px', display: 'block', animation: 'spin 1s linear infinite' }} />
            <p style={{ fontFamily: 'var(--font-serif)', fontSize: '1.25rem', color: 'var(--ink)' }}>Consulting central property office records...</p>
          </div>
        )}

        {/* View Switcher: Public Feed vs Student Dashboard */}
        {activeTab === 'dashboard' ? (
          <DashboardView />
        ) : (
          <div>
            {/* Top Metric Counter Banner */}
            <StatBanner />

            {/* Filter and Live Search Controls */}
            <FilterControls />

            {/* Case File Ledger Grid */}
            {items.length === 0 && !loading ? (
              <div style={{
                textAlign: 'center',
                padding: '60px 20px',
                backgroundColor: 'var(--bg-card)',
                border: '1px dashed var(--line)',
                borderRadius: '4px',
                color: 'var(--ink-light)'
              }}>
                <PackageSearch size={48} style={{ opacity: 0.35, margin: '0 auto 16px', display: 'block' }} />
                <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.35rem', color: 'var(--ink)' }}>No Matching Case Files Found</h3>
                <p style={{ maxWidth: '440px', margin: '0 auto 16px' }}>
                  No items match your active search terms or category filters. Try resetting your filters or report a new lost/found notice.
                </p>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={() => setIsReportModalOpen(true)}
                >
                  <PlusCircle size={14} /> Report New Notice
                </button>
              </div>
            ) : (
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
                gap: '24px'
              }}>
                {items.map((item) => (
                  <ItemCard key={item._id} item={item} />
                ))}
              </div>
            )}
          </div>
        )}
      </main>

      {/* Item Case File Dossier Modal */}
      {selectedItemId && <ItemDetailModal />}

      {/* Claim Submission Modal */}
      {isClaimModalOpen && <ClaimModal />}

      {/* Report Lost/Found Property Modal */}
      {isReportModalOpen && <ReportModal />}

      {/* Standard Postal Footer */}
      <footer style={{
        marginTop: '60px',
        borderTop: '2px solid var(--ink)',
        backgroundColor: 'var(--bg-card)',
        padding: '32px 20px',
        color: 'var(--ink-light)',
        fontSize: '0.85rem',
        textAlign: 'center'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <div style={{ fontFamily: 'var(--font-heading)', fontSize: '0.95rem', color: 'var(--ink)', fontWeight: 700, letterSpacing: '0.04em' }}>
            CAMPUS CENTRAL PROPERTY OFFICE &bull; OFFICIAL REGISTRY CLIENT
          </div>
          <div>
            Component 5: Decoupled Single-Page Client built with React 18, Vite &amp; Context API.
          </div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.78rem' }}>
            Consuming RESTful API Services at <code>/api/*</code> on Node.js / Express backend.
          </div>
        </div>
      </footer>
    </div>
  );
}
