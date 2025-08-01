import React from 'react';
import HistoryBlocker from './HistoryBlocker.js';
import AuthGuard from './AuthGuard.js';
import LogoutMessage from './LogoutMessage.js';

const AppProtection = ({ children }) => {
  return (
    <>
      <HistoryBlocker />
      <AuthGuard />
      <LogoutMessage />
      {children}
    </>
  );
};

export default AppProtection; 