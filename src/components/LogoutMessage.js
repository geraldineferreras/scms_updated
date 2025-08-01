import React, { useState, useEffect } from 'react';
import { Modal, ModalHeader, ModalBody, ModalFooter, Button } from 'reactstrap';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const LogoutMessage = () => {
  const [showModal, setShowModal] = useState(false);
  const { isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const handleShowLogoutMessage = () => {
      setShowModal(true);
    };

    // Listen for custom event to show logout message
    window.addEventListener('showLogoutMessage', handleShowLogoutMessage);
    return () => window.removeEventListener('showLogoutMessage', handleShowLogoutMessage);
  }, []);

  const handleOk = () => {
    setShowModal(false);
    navigate('/auth/logout', { replace: true });
  };

  return (
    <Modal isOpen={showModal} centered backdrop="static">
      <ModalHeader className="pb-0" style={{ fontWeight: 700, fontSize: 22, borderBottom: 'none', letterSpacing: 0.5 }}>
        Session Expired
      </ModalHeader>
      <ModalBody className="text-center" style={{ fontSize: 16, paddingTop: 0, background: '#f8fafc', borderRadius: '0 0 20px 20px' }}>
        You have been logged out. Please log in again to continue.
      </ModalBody>
      <ModalFooter className="border-0 pt-0 d-flex justify-content-end" style={{ background: '#f8fafc', borderRadius: '0 0 20px 20px' }}>
        <Button color="primary" onClick={handleOk} style={{ borderRadius: 10, fontWeight: 600, minWidth: 90, fontSize: 15, padding: '8px 0' }}>
          OK
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default LogoutMessage; 