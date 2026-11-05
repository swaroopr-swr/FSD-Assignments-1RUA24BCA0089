import React from 'react';
import { useApp } from '../context/AppContext';
import StatusBadge from './StatusBadge';
import { X, MapPin, Calendar, User, FileText, Check, ShieldAlert, Award } from 'lucide-react';

export default function ItemDetailModal() {
  const {
    selectedItemDetails,
    setSelectedItemId,
    setIsClaimModalOpen,
    currentStudent,
    handleDecideClaim
  } = useApp();

  if (!selectedItemDetails || !selectedItemDetails.item) return null;

  const { item, isFinder, claims } = selectedItemDetails;
  const isFound = item.itemType === 'found';
  const refCode = 'LF-' + (item._id ? item._id.slice(-6).toUpperCase() : '000000');

  const formattedDate = item.date
    ? new Date(item.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
    : 'Date unrecorded';

  const userClaim = claims?.find(
    (c) => c.claimedBy && currentStudent && c.claimedBy._id?.toString() === currentStudent._id?.toString()
  );

  return (
    <div className="modal-overlay" onClick={() => setSelectedItemId(null)}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ borderTop: `5px solid ${isFound ? 'var(--found-blue)' : 'var(--rust)'}` }}>
        {/* Header */}
        <div style={{
          padding: '20px 24px',
          borderBottom: '1px solid var(--line)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start'
        }}>
          <div>
            <div style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.8rem',
              color: isFound ? 'var(--found-blue)' : 'var(--rust)',
              fontWeight: 600,
              marginBottom: '4px'
            }}>
              CASE DOSSIER · {refCode}
            </div>
            <h2 style={{
              fontFamily: 'var(--font-serif)',
              fontSize: '1.8rem',
              color: 'var(--ink)',
              margin: 0
            }}>
              {item.itemName}
            </h2>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <StatusBadge status={item.status} />
            <button
              onClick={() => setSelectedItemId(null)}
              style={{ background: 'transparent', color: 'var(--ink-soft)', padding: '4px' }}
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Case File Details Body */}
        <div style={{ padding: '24px' }}>
          {/* Metadata Table */}
          <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '24px', fontSize: '0.9rem' }}>
            <tbody>
              <tr style={{ borderBottom: '1px solid var(--line)' }}>
                <td style={{ padding: '8px 0', color: 'var(--ink-soft)', width: '30%', fontWeight: 500 }}>Category</td>
                <td style={{ padding: '8px 0', color: 'var(--ink)' }}>{item.category}</td>
              </tr>
              <tr style={{ borderBottom: '1px solid var(--line)' }}>
                <td style={{ padding: '8px 0', color: 'var(--ink-soft)', fontWeight: 500 }}>{isFound ? 'Found Location' : 'Last Seen Location'}</td>
                <td style={{ padding: '8px 0', color: 'var(--ink)' }}>{item.location}</td>
              </tr>
              <tr style={{ borderBottom: '1px solid var(--line)' }}>
                <td style={{ padding: '8px 0', color: 'var(--ink-soft)', fontWeight: 500 }}>{isFound ? 'Date Discovered' : 'Date Lost'}</td>
                <td style={{ padding: '8px 0', color: 'var(--ink)' }}>{formattedDate}</td>
              </tr>
              <tr style={{ borderBottom: '1px solid var(--line)' }}>
                <td style={{ padding: '8px 0', color: 'var(--ink-soft)', fontWeight: 500 }}>Reported By</td>
                <td style={{ padding: '8px 0', color: 'var(--ink)' }}>
                  {item.reportedBy?.fullName || 'Campus Member'} {item.reportedBy?.department ? `(${item.reportedBy.department})` : ''}
                </td>
              </tr>
              <tr>
                <td style={{ padding: '12px 0', color: 'var(--ink-soft)', fontWeight: 500, verticalAlign: 'top' }}>Description</td>
                <td style={{ padding: '12px 0', color: 'var(--ink)', whiteSpace: 'pre-wrap', lineHeight: 1.6 }}>{item.description}</td>
              </tr>
            </tbody>
          </table>

          {/* Claims & Ownership Section (For Found Items) */}
          {isFound && (
            <div style={{
              marginTop: '24px',
              borderTop: '2px solid var(--line-strong)',
              paddingTop: '20px'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Award size={18} color="var(--found-blue)" />
                  <h3 style={{ fontSize: '1.2rem', fontFamily: 'var(--font-serif)', margin: 0 }}>
                    Ownership Claims Ledger
                  </h3>
                </div>
                {item.status === 'Returned' && (
                  <span style={{ fontSize: '0.8rem', color: 'var(--olive)', fontWeight: 600 }}>
                    Custody Closed (Returned)
                  </span>
                )}
              </div>

              {/* State A: Finder's View of Claims */}
              {isFinder ? (
                <div>
                  <div style={{
                    backgroundColor: 'var(--bg-soft)',
                    padding: '10px 14px',
                    borderRadius: '4px',
                    fontSize: '0.85rem',
                    marginBottom: '16px',
                    color: 'var(--ink)'
                  }}>
                    <strong>Finder Notice:</strong> You reported this item. As custodian, you are responsible for approving or rejecting filed ownership claims.
                  </div>

                  {claims && claims.length > 0 ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      {claims.map((claim) => (
                        <div
                          key={claim._id}
                          style={{
                            border: '1px solid var(--line)',
                            borderRadius: '4px',
                            padding: '14px',
                            backgroundColor: '#fff'
                          }}
                        >
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                            <div>
                              <strong style={{ fontSize: '0.95rem' }}>{claim.claimedBy?.fullName || 'Claimant'}</strong>
                              <span style={{ fontSize: '0.8rem', color: 'var(--ink-soft)', marginLeft: '8px' }}>
                                {claim.claimedBy?.department}
                              </span>
                            </div>
                            <StatusBadge status={claim.status} />
                          </div>

                          <div style={{
                            fontSize: '0.88rem',
                            color: 'var(--ink)',
                            backgroundColor: 'var(--bg-parchment)',
                            padding: '10px',
                            borderRadius: '3px',
                            marginBottom: '10px',
                            fontFamily: 'var(--font-sans)',
                            whiteSpace: 'pre-wrap'
                          }}>
                            <strong>Stated Proof:</strong> {claim.reason}
                          </div>

                          {/* Claimant contact revealed only if approved (Privacy Rule) */}
                          {claim.status === 'Approved' && claim.claimedBy?.contactNumber && (
                            <div style={{ fontSize: '0.8rem', color: 'var(--olive)', fontWeight: 600, marginBottom: '8px' }}>
                              Claimant Contact: {claim.claimedBy.contactNumber}
                            </div>
                          )}

                          {/* Finder Decision Buttons (Only if Pending and item is Available) */}
                          {claim.status === 'Pending' && item.status === 'Available' && (
                            <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end', marginTop: '10px' }}>
                              <button
                                onClick={() => handleDecideClaim(claim._id, 'Approved')}
                                className="btn btn-sm"
                                style={{ backgroundColor: 'var(--olive)', color: '#fff' }}
                              >
                                <Check size={14} /> Approve Claim (Mark Returned)
                              </button>
                              <button
                                onClick={() => handleDecideClaim(claim._id, 'Rejected')}
                                className="btn btn-sm"
                                style={{ backgroundColor: 'var(--rust)', color: '#fff' }}
                              >
                                <X size={14} /> Reject
                              </button>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div style={{ color: 'var(--ink-muted)', fontStyle: 'italic', fontSize: '0.9rem' }}>
                      No claims lodged for this property yet.
                    </div>
                  )}
                </div>
              ) : (
                /* State B: Visitor / Non-Finder View */
                <div>
                  {userClaim ? (
                    <div style={{
                      backgroundColor: 'var(--bg-soft)',
                      border: '1px solid var(--line-strong)',
                      padding: '16px',
                      borderRadius: '4px'
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                        <span style={{ fontWeight: 600, fontSize: '0.95rem' }}>Your Claim Slip</span>
                        <StatusBadge status={userClaim.status} />
                      </div>
                      <p style={{ fontSize: '0.9rem', color: 'var(--ink)', marginBottom: '8px' }}>
                        {userClaim.reason}
                      </p>
                      <div style={{ fontSize: '0.8rem', color: 'var(--ink-soft)' }}>
                        {userClaim.status === 'Pending' && 'Your claim is currently awaiting review by the finder.'}
                        {userClaim.status === 'Approved' && 'Your claim was Approved! You may retrieve your property.'}
                        {userClaim.status === 'Rejected' && 'Your claim was rejected by the finder.'}
                      </div>
                    </div>
                  ) : item.status === 'Available' ? (
                    <div>
                      <p style={{ fontSize: '0.9rem', color: 'var(--ink-soft)', marginBottom: '16px' }}>
                        Recognize this discovered property? Submit a proof-of-ownership claim slip with specific markings, serial numbers, or details only the true owner would know.
                      </p>
                      <button
                        onClick={() => setIsClaimModalOpen(true)}
                        className="btn btn-rust"
                      >
                        <FileText size={16} /> Lodge Ownership Claim Slip &rarr;
                      </button>
                    </div>
                  ) : (
                    <div style={{ color: 'var(--ink-muted)', fontStyle: 'italic', fontSize: '0.9rem' }}>
                      This item has already been marked as Returned. No further claims are accepted.
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
