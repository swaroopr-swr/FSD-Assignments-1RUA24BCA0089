import React from 'react';
import { Row, Col } from 'react-bootstrap';

const PostGrid = ({ children }) => {
  return (
    <Row className="g-1 g-md-3">
      {children}
    </Row>
  );
};

export default PostGrid;
