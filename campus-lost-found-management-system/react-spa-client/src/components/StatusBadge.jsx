import React from 'react';

/**
 * Modular Rubber Stamp Badge Component
 * Renders authentic postal and registry status stamps.
 */
export default function StatusBadge({ status }) {
  if (!status) return null;

  const normalized = status.toLowerCase();

  let stampClass = 'stamp-available';
  if (normalized === 'returned') stampClass = 'stamp-returned';
  if (normalized === 'lost') stampClass = 'stamp-lost';
  if (normalized === 'pending') stampClass = 'stamp-pending';
  if (normalized === 'approved') stampClass = 'stamp-approved';
  if (normalized === 'rejected') stampClass = 'stamp-rejected';

  return <span className={`stamp ${stampClass}`}>{status}</span>;
}
