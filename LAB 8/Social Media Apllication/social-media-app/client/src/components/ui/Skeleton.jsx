import React from 'react';
import { Placeholder } from 'react-bootstrap';
import { Card } from 'react-bootstrap';
import PerforatedDivider from './PerforatedDivider';

const Skeleton = () => {
  return (
    <Card className="mb-4">
      <Card.Body className="p-4">
        <div className="d-flex align-items-center mb-3">
          <div style={{ width: 44, height: 44, borderRadius: '50%', backgroundColor: 'var(--m-paper-2)' }} className="me-3"></div>
          <div className="flex-grow-1">
            <Placeholder as="div" animation="glow">
              <Placeholder xs={4} style={{ backgroundColor: 'var(--m-paper-2)' }} /> <br />
              <Placeholder xs={3} size="sm" style={{ backgroundColor: 'var(--m-paper-2)' }} />
            </Placeholder>
          </div>
        </div>
        <Placeholder as="p" animation="glow">
          <Placeholder xs={12} style={{ backgroundColor: 'var(--m-paper-2)' }} />
          <Placeholder xs={8} style={{ backgroundColor: 'var(--m-paper-2)' }} />
        </Placeholder>
        <PerforatedDivider />
        <Placeholder as="div" animation="glow" className="d-flex justify-content-between">
          <Placeholder xs={2} style={{ backgroundColor: 'var(--m-paper-2)' }} />
          <Placeholder xs={2} style={{ backgroundColor: 'var(--m-paper-2)' }} />
          <Placeholder xs={2} style={{ backgroundColor: 'var(--m-paper-2)' }} />
        </Placeholder>
      </Card.Body>
    </Card>
  );
};

export default Skeleton;
