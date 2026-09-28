import React from 'react';
import SectionCard from '../components/ui/SectionCard';
import EmptyState from '../components/ui/EmptyState';

const MessagesPage = () => {
  return (
    <div className="pb-4 h-100">
      <h1 className="mb-4" style={{ fontFamily: 'var(--m-font-serif)', fontSize: '2rem' }}>Messages</h1>
      <SectionCard title="DIRECT MESSAGES" className="h-100">
        <EmptyState message="NO NEW MESSAGES" />
      </SectionCard>
    </div>
  );
};

export default MessagesPage;
