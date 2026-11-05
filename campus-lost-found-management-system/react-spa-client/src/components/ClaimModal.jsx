import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { X, Send, AlertTriangle } from 'lucide-react';

export default function ClaimModal() {
  const {
    selectedItemDetails,
    isClaimModalOpen,
    setIsClaimModalOpen,
    handleSubmitClaim,
    currentStudent
  } = useApp();

  const [reason, setReason] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isClaimModalOpen || !selectedItemDetails || !selectedItemDetails.item) return null;

  const { item } = selectedItemDetails;
  const charCount = reason.trim().length;
  const isValidLength = charCount >= 10 && charCount <= 500;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!isValidLength) {
      setError('Proof of ownership must be between 10 and 500 characters.');
      return;
    }

    setIsSubmitting(true);
    const result = await handleSubmitClaim(item._id, reason);
    setIsSubmitting(false);

    if (!result.success) {
      setError(result.error || 'Failed to submit claim');
    } else {
      setReason('');
    }
  };

  return (
    <div className="modal-overlay" onClick={() => setIsClaimModalOpen(false)} style={{ zIndex: 1100 }}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '520px', borderTop: '4px solid var(--rust)' }}>
        {/* Header */}
        <div style={{
          padding: '16px 20px',
          borderBottom: '1px solid var(--line)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--rust)', fontWeight: 600 }}>
              FILING SLIP · OWNERSHIP CLAIM
            </div>
            <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.3rem', margin: 0, color: 'var(--ink)' }}>
              Claim: {item.itemName}
            </h3>
          </div>
          <button onClick={() => setIsClaimModalOpen(false)} style={{ background: 'transparent', color: 'var(--ink-soft)' }}>
            <X size={18} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} style={{ padding: '20px' }}>
          <div style={{
            backgroundColor: 'var(--bg-soft)',
            padding: '10px 14px',
            borderRadius: '4px',
            fontSize: '0.85rem',
            marginBottom: '16px',
            color: 'var(--ink-soft)'
          }}>
            Filing as: <strong style={{ color: 'var(--ink)' }}>{currentStudent?.fullName || 'Active Student'}</strong> ({currentStudent?.department})
          </div>

          {error && (
            <div style={{
              backgroundColor: 'var(--rust-light)',
              color: 'var(--rust)',
              border: '1px solid var(--rust)',
              padding: '10px 12px',
              borderRadius: '4px',
              fontSize: '0.85rem',
              marginBottom: '16px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <AlertTriangle size={16} />
              <span>{error}</span>
            </div>
          )}

          <div className="form-group">
            <label className="form-label" htmlFor="claim-reason">
              Ownership Proof &amp; Identifying Marks <span style={{ color: 'var(--rust)' }}>*</span>
            </label>
            <p style={{ fontSize: '0.8rem', color: 'var(--ink-soft)', marginBottom: '8px' }}>
              State specific details only the owner knows (scratches, unique stickers, internal files, serial codes):
            </p>
            <textarea
              id="claim-reason"
              className="form-textarea"
              placeholder="e.g. In the zippered pocket there is a blue flash drive with my initials marked..."
              value={reason}
              onChange={(e) => {
                setReason(e.target.value);
                if (error) setError('');
              }}
              rows={5}
              required
            />
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginTop: '6px',
              fontSize: '0.75rem',
              fontFamily: 'var(--font-mono)'
            }}>
              <span style={{ color: isValidLength ? 'var(--olive)' : 'var(--rust)' }}>
                {charCount} / 500 characters {charCount < 10 ? `(need ${10 - charCount} more)` : ''}
              </span>
              <span style={{ color: 'var(--ink-muted)' }}>Min 10 chars</span>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '24px' }}>
            <button
              type="button"
              onClick={() => setIsClaimModalOpen(false)}
              className="btn btn-secondary"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!isValidLength || isSubmitting}
              className="btn btn-rust"
              style={{ opacity: isValidLength && !isSubmitting ? 1 : 0.6 }}
            >
              <Send size={14} /> {isSubmitting ? 'Lodging Slip...' : 'Submit Claim Slip'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
