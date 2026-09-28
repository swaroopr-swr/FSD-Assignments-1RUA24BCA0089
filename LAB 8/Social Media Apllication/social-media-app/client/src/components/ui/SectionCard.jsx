import React from 'react';
import { Card } from 'react-bootstrap';
import PerforatedDivider from './PerforatedDivider';

const SectionCard = ({ title, children, className = '' }) => {
  return (
    <Card className={`mb-4 ${className} border-0 shadow-sm`} style={{ background: 'var(--m-card)' }}>
      <Card.Body className="p-4">
        <h3 className="m-label mb-0">{title}</h3>
        <PerforatedDivider className="my-3" />
        {children}
      </Card.Body>
    </Card>
  );
};

export default SectionCard;
