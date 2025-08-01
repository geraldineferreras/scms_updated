/*!

=========================================================
* SCMS - Student Class Management System - v1.2.4
=========================================================

* A comprehensive student class management system
* Built with React and Bootstrap 4
* Licensed under MIT

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { Modal, ModalHeader, ModalBody, ModalFooter, Button } from "reactstrap";

import "assets/plugins/nucleo/css/nucleo.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "assets/scss/argon-dashboard-react.scss";

import AdminLayout from "layouts/Admin.js";
import AuthLayout from "layouts/Auth.js";
import StudentLayout from "layouts/Student.js";
import TeacherLayout from "layouts/Teacher.js";
import VideoConferenceLayout from "layouts/VideoConference.js";
import RemoteCameraMobile from './components/RemoteCameraMobile';
import ProtectedRoute from './components/ProtectedRoute.js';
import PublicRoute from './components/PublicRoute.js';
import HistoryBlocker from './components/HistoryBlocker.js';
import AuthGuard from './components/AuthGuard.js';
import LogoutMessage from './components/LogoutMessage.js';
import { AuthProvider } from "contexts/AuthContext.js";

function SessionTimeoutModal() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const handleTimeout = () => setOpen(true);
    window.addEventListener('sessionTimeout', handleTimeout);
    return () => window.removeEventListener('sessionTimeout', handleTimeout);
  }, []);

  const handleOk = () => {
    setOpen(false);
    window.location.href = '/auth/login';
  };

  return (
    <Modal isOpen={open} centered backdrop="static">
      <ModalHeader className="pb-0" style={{ fontWeight: 700, fontSize: 22, borderBottom: 'none', letterSpacing: 0.5 }}>Session Timed Out</ModalHeader>
      <ModalBody className="text-center" style={{ fontSize: 16, paddingTop: 0, background: '#f8fafc', borderRadius: '0 0 20px 20px' }}>
        Your session has timed out. Please log in again to continue.
      </ModalBody>
      <ModalFooter className="border-0 pt-0 d-flex justify-content-end" style={{ background: '#f8fafc', borderRadius: '0 0 20px 20px' }}>
        <Button color="primary" onClick={handleOk} style={{ borderRadius: 10, fontWeight: 600, minWidth: 90, fontSize: 15, padding: '8px 0' }}>OK</Button>
      </ModalFooter>
    </Modal>
  );
}

// Error Boundary Component
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('React Error Boundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          height: '100vh', 
          fontFamily: 'Arial, sans-serif',
          flexDirection: 'column',
          padding: '20px'
        }}>
          <h2>Something went wrong</h2>
          <p>Please refresh the page or contact support.</p>
          <button 
            onClick={() => window.location.reload()} 
            style={{
              padding: '10px 20px',
              backgroundColor: '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer'
            }}
          >
            Refresh Page
          </button>
          <details style={{ marginTop: '20px', textAlign: 'left' }}>
            <summary>Error Details</summary>
            <pre style={{ color: 'red', fontSize: '12px' }}>
              {this.state.error && this.state.error.toString()}
            </pre>
          </details>
        </div>
      );
    }

    return this.props.children;
  }
}

// Global error handler
window.addEventListener('error', (event) => {
  console.error('Global error caught:', event.error);
  const errorFallback = document.getElementById('error-fallback');
  const root = document.getElementById('root');
  if (errorFallback && root) {
    root.style.display = 'none';
    errorFallback.style.display = 'flex';
    document.getElementById('error-details').textContent = `Global error: ${event.error.toString()}`;
  }
});

window.addEventListener('unhandledrejection', (event) => {
  console.error('Unhandled promise rejection:', event.reason);
  const errorFallback = document.getElementById('error-fallback');
  const root = document.getElementById('root');
  if (errorFallback && root) {
    root.style.display = 'none';
    errorFallback.style.display = 'flex';
    document.getElementById('error-details').textContent = `Promise rejection: ${event.reason.toString()}`;
  }
});

const root = ReactDOM.createRoot(document.getElementById("root"));

// Add error boundary and debugging
console.log('React app starting...');
console.log('Environment:', process.env.NODE_ENV);
console.log('API URL:', process.env.REACT_APP_API_BASE_URL);
console.log('Root element:', document.getElementById("root"));
console.log('Current URL:', window.location.href);

try {
  root.render(
    <ErrorBoundary>
      <AuthProvider>
        <BrowserRouter>
          <SessionTimeoutModal />
          <HistoryBlocker />
          <AuthGuard />
          <LogoutMessage />
          <Routes>
            <Route path="/admin/*" element={
              <ProtectedRoute requiredRole="admin">
                <AdminLayout />
              </ProtectedRoute>
            } />
            <Route path="/student/*" element={
              <ProtectedRoute requiredRole="student">
                <StudentLayout />
              </ProtectedRoute>
            } />
            <Route path="/teacher/*" element={
              <ProtectedRoute requiredRole="teacher">
                <TeacherLayout />
              </ProtectedRoute>
            } />
            <Route path="/video-conference/*" element={
              <ProtectedRoute>
                <VideoConferenceLayout />
              </ProtectedRoute>
            } />
            <Route path="/auth/*" element={
              <PublicRoute>
                <AuthLayout />
              </PublicRoute>
            } />
            <Route path="/remote-camera" element={<RemoteCameraMobile />} />
            <Route path="*" element={<Navigate to="/auth/login" replace />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ErrorBoundary>
  );
  console.log('React app rendered successfully');
} catch (error) {
  console.error('Error rendering React app:', error);
  document.getElementById("root").innerHTML = `
    <div style="display: flex; justify-content: center; align-items: center; height: 100vh; font-family: Arial, sans-serif; flex-direction: column;">
      <h2>Failed to load application</h2>
      <p>Please refresh the page or contact support.</p>
      <button onclick="window.location.reload()" style="padding: 10px 20px; background-color: #007bff; color: white; border: none; border-radius: 5px; cursor: pointer;">
        Refresh Page
      </button>
      <details style="margin-top: 20px; text-align: left;">
        <summary>Error Details</summary>
        <pre style="color: red; font-size: 12px;">${error.toString()}</pre>
      </details>
    </div>
  `;
}
