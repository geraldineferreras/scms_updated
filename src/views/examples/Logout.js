import React, { useEffect } from 'react';
import { Container, Row, Col, Card, CardBody } from 'reactstrap';

const Logout = () => {
  useEffect(() => {
    // Clear any remaining authentication data
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('scms_logged_in_user');
    sessionStorage.clear();
    
    // Clear browser history to prevent back button from working
    window.history.pushState(null, '', '/auth/logout');
    window.history.pushState(null, '', '/auth/logout');
    window.history.pushState(null, '', '/auth/logout');
    
    // Redirect to login page after a short delay
    const timer = setTimeout(() => {
      window.location.replace('/auth/login');
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="main-content">
      <div className="header bg-gradient-info py-7 py-lg-8">
        <div className="separator separator-bottom separator-skew zindex-100">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            preserveAspectRatio="none"
            version="1.1"
            viewBox="0 0 2560 100"
            x="0"
            y="0"
          >
            <polygon
              className="fill-default"
              points="2560 0 2560 100 0 100"
            />
          </svg>
        </div>
      </div>
      <Container className="mt--8 pb-5">
        <Row className="justify-content-center">
          <Col lg="6" md="8">
            <Card className="bg-secondary shadow border-0">
              <CardBody className="px-lg-5 py-lg-5">
                <div className="text-center text-muted mb-4">
                  <h3>Logging out...</h3>
                  <p>You have been successfully logged out.</p>
                  <div className="spinner-border text-primary" role="status">
                    <span className="sr-only">Loading...</span>
                  </div>
                  <p className="mt-3">Redirecting to login page...</p>
                </div>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Logout; 