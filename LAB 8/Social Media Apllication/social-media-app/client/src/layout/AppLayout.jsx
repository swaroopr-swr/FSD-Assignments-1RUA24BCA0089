import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Container, Row, Col } from 'react-bootstrap';
import TopNavbar from './TopNavbar';
import LeftSidebar from './LeftSidebar';
import RightSidebar from './RightSidebar';
import MobileTabBar from './MobileTabBar';
import MobileMenu from './MobileMenu';

const AppLayout = () => {
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  return (
    <>
      <TopNavbar onOpenMenu={() => setShowMobileMenu(true)} />
      <MobileMenu show={showMobileMenu} onHide={() => setShowMobileMenu(false)} />
      
      <Container className="pt-4 pb-5 pb-md-0" style={{ maxWidth: '1320px' }}>
        <Row className="justify-content-center">
          
          {/* Left Sidebar (Desktop/Tablet) */}
          <Col md="auto" className="d-none d-md-block" style={{ width: 'var(--m-sidebar-w)', alignSelf: 'flex-start', position: 'sticky', top: 'calc(var(--m-navbar-h) + 24px)' }}>
            <LeftSidebar />
          </Col>
          
          {/* Center Feed */}
          <Col className="d-flex justify-content-center" style={{ minWidth: 0 }}>
            <div style={{ width: '100%', maxWidth: 'var(--m-feed-max)' }}>
              <Outlet />
            </div>
          </Col>
          
          {/* Right Sidebar (Desktop only) */}
          <Col lg="auto" className="d-none d-lg-block" style={{ width: 'var(--m-right-w)', alignSelf: 'flex-start', position: 'sticky', top: 'calc(var(--m-navbar-h) + 24px)' }}>
            <RightSidebar />
          </Col>
          
        </Row>
      </Container>
      
      {/* Mobile Tab Bar (Mobile only) */}
      <div className="d-block d-md-none" style={{ height: '72px' }}></div>
      <MobileTabBar />
    </>
  );
};

export default AppLayout;
