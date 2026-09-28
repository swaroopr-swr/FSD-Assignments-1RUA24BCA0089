import React from 'react';
import SectionCard from '../components/ui/SectionCard';
import StampButton from '../components/ui/StampButton';

const SettingsPage = () => {
  return (
    <div className="pb-4">
      <h1 className="mb-4" style={{ fontFamily: 'var(--m-font-serif)', fontSize: '2rem' }}>Settings</h1>
      
      <SectionCard title="ACCOUNT">
        <div className="mb-3 d-flex justify-content-between align-items-center">
          <div style={{ fontFamily: 'var(--m-font-serif)', fontSize: '1.05rem' }}>Email Address</div>
          <div className="m-label">student@university.edu</div>
        </div>
        <div className="mb-3 d-flex justify-content-between align-items-center">
          <div style={{ fontFamily: 'var(--m-font-serif)', fontSize: '1.05rem' }}>Password</div>
          <StampButton variant="outline" size="sm">CHANGE</StampButton>
        </div>
      </SectionCard>

      <SectionCard title="APPEARANCE">
        <div className="mb-3 d-flex justify-content-between align-items-center">
          <div style={{ fontFamily: 'var(--m-font-serif)', fontSize: '1.05rem' }}>Theme</div>
          <div className="m-label">PAPER (DEFAULT)</div>
        </div>
      </SectionCard>

      <SectionCard title="DANGER ZONE">
        <StampButton variant="outline" className="text-danger border-danger">
          DELETE ACCOUNT
        </StampButton>
      </SectionCard>
    </div>
  );
};

export default SettingsPage;
