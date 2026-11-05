import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { X, PlusCircle, AlertCircle } from 'lucide-react';

export default function ReportModal() {
  const {
    isReportModalOpen,
    setIsReportModalOpen,
    categories,
    handleReportItem,
    currentStudent
  } = useApp();

  const [itemType, setItemType] = useState('found'); // 'found' | 'lost'
  const [itemName, setItemName] = useState('');
  const [category, setCategory] = useState(categories[0] || 'Bottles & Accessories');
  const [location, setLocation] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isReportModalOpen) return null;

  const isLost = itemType === 'lost';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (itemName.trim().length < 2) {
      setError('Item name must be at least 2 characters.');
      return;
    }

    if (description.trim().length < 10) {
      setError('Description must be at least 10 characters.');
      return;
    }

    if (!location.trim()) {
      setError('Location is required.');
      return;
    }

    setIsSubmitting(true);
    const result = await handleReportItem({
      itemType,
      itemName,
      category,
      location,
      date,
      description
    });
    setIsSubmitting(false);

    if (!result.success) {
      setError(result.error || 'Failed to lodge report.');
    } else {
      // Reset form
      setItemName('');
      setLocation('');
      setDescription('');
    }
  };

  return (
    <div className="modal-overlay" onClick={() => setIsReportModalOpen(false)}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ borderTop: `4px solid ${isLost ? 'var(--rust)' : 'var(--found-blue)'}` }}>
        {/* Header */}
        <div style={{
          padding: '16px 20px',
          borderBottom: '1px solid var(--line)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div>
            <div style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.75rem',
              color: isLost ? 'var(--rust)' : 'var(--found-blue)',
              fontWeight: 600
            }}>
              PROPERTY OFFICE FILING SLIP
            </div>
            <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.4rem', margin: 0, color: 'var(--ink)' }}>
              Lodge {isLost ? 'Lost Notice' : 'Found Article'}
            </h3>
          </div>
          <button onClick={() => setIsReportModalOpen(false)} style={{ background: 'transparent', color: 'var(--ink-soft)' }}>
            <X size={18} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} style={{ padding: '20px' }}>
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
              <AlertCircle size={16} />
              <span>{error}</span>
            </div>
          )}

          {/* Type Toggle Pills (State: itemType) */}
          <div style={{ marginBottom: '18px' }}>
            <label className="form-label">Report Category Type</label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              <button
                type="button"
                onClick={() => setItemType('found')}
                className="btn btn-sm"
                style={{
                  backgroundColor: !isLost ? 'var(--found-blue)' : 'var(--bg-soft)',
                  color: !isLost ? '#fff' : 'var(--ink)',
                  border: '1px solid var(--line-strong)',
                  padding: '10px'
                }}
              >
                Discovered (Found Item)
              </button>
              <button
                type="button"
                onClick={() => setItemType('lost')}
                className="btn btn-sm"
                style={{
                  backgroundColor: isLost ? 'var(--rust)' : 'var(--bg-soft)',
                  color: isLost ? '#fff' : 'var(--ink)',
                  border: '1px solid var(--line-strong)',
                  padding: '10px'
                }}
              >
                Misplaced (Lost Item)
              </button>
            </div>
          </div>

          {/* Item Name */}
          <div className="form-group">
            <label className="form-label" htmlFor="itemName">Item Name / Title <span style={{ color: 'var(--rust)' }}>*</span></label>
            <input
              id="itemName"
              type="text"
              className="form-input"
              placeholder="e.g. Stainless Steel Thermal Flask, Blue Spiral Notebook..."
              value={itemName}
              onChange={(e) => setItemName(e.target.value)}
              required
            />
          </div>

          {/* Category & Date Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
            <div className="form-group">
              <label className="form-label" htmlFor="category">Category <span style={{ color: 'var(--rust)' }}>*</span></label>
              <select
                id="category"
                className="form-select"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="date">{isLost ? 'Date Misplaced' : 'Date Found'} <span style={{ color: 'var(--rust)' }}>*</span></label>
              <input
                id="date"
                type="date"
                className="form-input"
                value={date}
                max={new Date().toISOString().split('T')[0]}
                onChange={(e) => setDate(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Location */}
          <div className="form-group">
            <label className="form-label" htmlFor="location">{isLost ? 'Last Seen Location' : 'Discovered Location'} <span style={{ color: 'var(--rust)' }}>*</span></label>
            <input
              id="location"
              type="text"
              className="form-input"
              placeholder="e.g. Library 2nd Floor Reading Room, Cafeteria Bench..."
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              required
            />
          </div>

          {/* Description */}
          <div className="form-group">
            <label className="form-label" htmlFor="description">Detailed Description <span style={{ color: 'var(--rust)' }}>*</span></label>
            <textarea
              id="description"
              className="form-textarea"
              placeholder="Describe color, brand, markings, condition (10-500 characters)..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              required
            />
          </div>

          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginTop: '24px',
            borderTop: '1px solid var(--line)',
            paddingTop: '16px'
          }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--ink-soft)' }}>
              Filing under: <strong>{currentStudent?.fullName || 'Current Student'}</strong>
            </span>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                type="button"
                onClick={() => setIsReportModalOpen(false)}
                className="btn btn-secondary"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="btn btn-primary"
              >
                <PlusCircle size={15} /> {isSubmitting ? 'Lodging...' : 'Submit Report'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
