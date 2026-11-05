import React from 'react';
import { useApp } from '../context/AppContext';
import StatusBadge from './StatusBadge';
import { ShieldCheck, Inbox, Clock, CheckCircle, XCircle, ArrowRight, FolderKanban, PlusCircle } from 'lucide-react';

/**
 * DashboardView Component
 *
 * Dedicated personal docket for the signed-in student.
 * Demonstrates:
 * - Derived state calculation (filtering personal items, pending claims)
 * - Event handling for claim approval/rejection directly from the dashboard
 * - Component composition & interactive navigation
 */
export default function DashboardView() {
  const {
    currentStudent,
    items,
    setSelectedItemId,
    handleDecideClaim,
    setActiveTab,
    setIsReportModalOpen
  } = useApp();

  if (!currentStudent) {
    return (
      <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--ink-light)' }}>
        <Inbox size={48} style={{ opacity: 0.4, margin: '0 auto 16px', display: 'block' }} />
        <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.4rem', color: 'var(--ink)' }}>No Student Identity Selected</h3>
        <p>Please select a student identity from the top header to inspect their personal case files and pending claims.</p>
      </div>
    );
  }

  // Filter items reported by this student
  const myItems = items.filter((item) => {
    if (!item.reportedBy) return false;
    const reportedId = typeof item.reportedBy === 'object' ? item.reportedBy._id : item.reportedBy;
    return reportedId?.toString() === currentStudent._id?.toString();
  });

  const myLostItems = myItems.filter((i) => i.itemType === 'lost');
  const myFoundItems = myItems.filter((i) => i.itemType === 'found');

  // Find all pending claims on found items reported by this student
  const claimsAwaitingDecision = [];
  myFoundItems.forEach((item) => {
    if (Array.isArray(item.claims)) {
      item.claims.forEach((claim) => {
        if (claim.status === 'Pending') {
          claimsAwaitingDecision.push({
            ...claim,
            parentItem: item
          });
        }
      });
    }
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      {/* Student Dossier Header Card */}
      <section style={{
        backgroundColor: 'var(--bg-card)',
        border: '1px solid var(--line)',
        borderLeft: '5px solid var(--rust)',
        borderRadius: '4px',
        padding: '24px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.04)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
              <span style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                backgroundColor: 'rgba(56, 102, 65, 0.12)',
                color: 'var(--olive)',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.72rem',
                fontWeight: 700,
                padding: '3px 8px',
                borderRadius: '3px',
                letterSpacing: '0.04em'
              }}>
                <ShieldCheck size={14} /> OFFICIAL ROSTER VERIFIED
              </span>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: 'var(--ink-light)' }}>
                USN: {currentStudent.usn}
              </span>
            </div>
            <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.9rem', margin: '4px 0', color: 'var(--ink)' }}>
              {currentStudent.fullName}
            </h2>
            <p style={{ margin: 0, color: 'var(--ink-light)', fontSize: '0.95rem' }}>
              {currentStudent.department} &bull; {currentStudent.email}
            </p>
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => setActiveTab('feed')}
            >
              Browse Registry Feed
            </button>
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => setIsReportModalOpen(true)}
            >
              <PlusCircle size={15} /> File Case Notice
            </button>
          </div>
        </div>

        {/* Mini stats counters */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
          gap: '16px',
          marginTop: '20px',
          paddingTop: '16px',
          borderTop: '1px dashed var(--line)'
        }}>
          <div>
            <div style={{ fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--ink-light)', fontFamily: 'var(--font-mono)' }}>Total Filings</div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '1.6rem', fontWeight: 700 }}>{myItems.length}</div>
          </div>
          <div>
            <div style={{ fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--ink-light)', fontFamily: 'var(--font-mono)' }}>Lost Notices</div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '1.6rem', fontWeight: 700, color: 'var(--rust)' }}>{myLostItems.length}</div>
          </div>
          <div>
            <div style={{ fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--ink-light)', fontFamily: 'var(--font-mono)' }}>Found Property</div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '1.6rem', fontWeight: 700, color: 'var(--found-blue)' }}>{myFoundItems.length}</div>
          </div>
          <div>
            <div style={{ fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--rust)', fontFamily: 'var(--font-mono)', fontWeight: 700 }}>Action Required</div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '1.6rem', fontWeight: 700, color: 'var(--rust)' }}>{claimsAwaitingDecision.length}</div>
          </div>
        </div>
      </section>

      {/* Action Required: Pending Claims */}
      <section>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px', flexWrap: 'wrap', gap: '8px' }}>
          <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.4rem', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Clock size={20} color="var(--rust)" /> Claims Awaiting Your Decision ({claimsAwaitingDecision.length})
          </h3>
          <span style={{ fontSize: '0.82rem', color: 'var(--ink-light)' }}>
            Rule: Only you as the finder who reported this property can approve or reject ownership claims.
          </span>
        </div>

        {claimsAwaitingDecision.length === 0 ? (
          <div style={{
            backgroundColor: 'var(--bg-card)',
            border: '1px solid var(--line)',
            borderRadius: '4px',
            padding: '32px 20px',
            textAlign: 'center',
            color: 'var(--ink-light)'
          }}>
            <CheckCircle size={32} style={{ color: 'var(--olive)', margin: '0 auto 8px', display: 'block' }} />
            <p style={{ margin: 0, fontSize: '0.95rem' }}>All caught up! There are no pending claims requiring your review right now.</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {claimsAwaitingDecision.map((claim) => (
              <div
                key={claim._id}
                style={{
                  backgroundColor: 'var(--bg-card)',
                  border: '1px solid var(--line)',
                  borderLeft: '4px solid var(--rust)',
                  borderRadius: '4px',
                  padding: '18px 20px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.04)'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '8px' }}>
                  <div>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--ink-light)', marginRight: '6px' }}>ON ITEM:</span>
                    <button
                      type="button"
                      onClick={() => setSelectedItemId(claim.parentItem._id)}
                      style={{
                        background: 'none',
                        border: 'none',
                        padding: 0,
                        fontFamily: 'var(--font-serif)',
                        fontSize: '1.15rem',
                        fontWeight: 700,
                        color: 'var(--ink)',
                        cursor: 'pointer',
                        textDecoration: 'underline'
                      }}
                    >
                      {claim.parentItem.itemName}
                    </button>
                    <div style={{ fontSize: '0.85rem', color: 'var(--ink-light)', marginTop: '4px' }}>
                      Claimant: <strong>{claim.claimedBy?.fullName || 'Registered Student'}</strong> ({claim.claimedBy?.usn || 'USN Recorded'})
                    </div>
                  </div>
                  <StatusBadge status="Pending" />
                </div>

                <div style={{
                  background: 'var(--bg-parchment)',
                  padding: '12px 14px',
                  border: '1px solid var(--line)',
                  borderRadius: '3px',
                  fontStyle: 'italic',
                  fontSize: '0.92rem',
                  lineHeight: 1.5
                }}>
                  &ldquo;{claim.reason}&rdquo;
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
                  <span style={{ fontSize: '0.8rem', color: 'var(--ink-light)', fontFamily: 'var(--font-mono)' }}>
                    Filed on {new Date(claim.createdAt || Date.now()).toLocaleDateString('en-GB')}
                  </span>

                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                      type="button"
                      className="btn btn-secondary"
                      style={{ color: 'var(--rust)', borderColor: 'var(--rust)', padding: '6px 12px', fontSize: '0.85rem' }}
                      onClick={() => handleDecideClaim(claim._id, 'Rejected')}
                    >
                      <XCircle size={14} /> Reject Claim
                    </button>
                    <button
                      type="button"
                      className="btn btn-primary"
                      style={{ background: 'var(--olive)', borderColor: 'var(--olive)', color: '#fff', padding: '6px 14px', fontSize: '0.85rem' }}
                      onClick={() => handleDecideClaim(claim._id, 'Approved')}
                    >
                      <CheckCircle size={14} /> Approve &amp; Mark Returned
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* My Reported Items Dossier */}
      <section>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
          <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.4rem', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
            <FolderKanban size={20} color="var(--found-blue)" /> Your Filed Case Slips ({myItems.length})
          </h3>
        </div>

        {myItems.length === 0 ? (
          <div style={{
            backgroundColor: 'var(--bg-card)',
            border: '1px solid var(--line)',
            borderRadius: '4px',
            padding: '32px 20px',
            textAlign: 'center',
            color: 'var(--ink-light)'
          }}>
            <p style={{ margin: 0, fontSize: '0.95rem' }}>You haven't filed any lost or found notices yet.</p>
            <button
              type="button"
              className="btn btn-primary"
              style={{ marginTop: '14px' }}
              onClick={() => setIsReportModalOpen(true)}
            >
              <PlusCircle size={14} /> Report an Item
            </button>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px' }}>
            {myItems.map((item) => (
              <div
                key={item._id}
                style={{
                  backgroundColor: 'var(--bg-card)',
                  border: '1px solid var(--line)',
                  borderTop: `3px solid ${item.itemType === 'found' ? 'var(--found-blue)' : 'var(--rust)'}`,
                  borderRadius: '4px',
                  padding: '16px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.04)'
                }}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'var(--ink-light)' }}>
                      LF-{item._id ? item._id.slice(-6).toUpperCase() : '000000'}
                    </span>
                    <StatusBadge status={item.status} />
                  </div>
                  <h4 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.15rem', margin: '0 0 6px 0', color: 'var(--ink)' }}>
                    {item.itemName}
                  </h4>
                  <p style={{
                    fontSize: '0.85rem',
                    color: 'var(--ink-light)',
                    margin: 0,
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden'
                  }}>
                    {item.description}
                  </p>
                </div>

                <div style={{
                  marginTop: '16px',
                  paddingTop: '12px',
                  borderTop: '1px solid var(--line)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <span style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.72rem',
                    padding: '2px 8px',
                    borderRadius: '2px',
                    backgroundColor: item.itemType === 'found' ? 'rgba(43, 76, 126, 0.1)' : 'rgba(164, 43, 39, 0.1)',
                    color: item.itemType === 'found' ? 'var(--found-blue)' : 'var(--rust)',
                    fontWeight: 600,
                    textTransform: 'uppercase'
                  }}>
                    {item.itemType}
                  </span>
                  <button
                    type="button"
                    className="btn btn-secondary"
                    style={{ padding: '4px 10px', fontSize: '0.8rem' }}
                    onClick={() => setSelectedItemId(item._id)}
                  >
                    Inspect Dossier <ArrowRight size={12} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
