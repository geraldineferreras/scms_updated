import React from "react";

const UserManagementIcon = ({ className = "" }) => {
  return (
    <div className={`custom-icon ${className}`} style={{ position: 'relative', display: 'inline-block', width: '20px', height: '20px' }}>
      {/* Settings gear */}
      <i className="ni ni-settings-gear-65" style={{ fontSize: '20px', position: 'absolute', top: '0', left: '0' }}></i>
      {/* Person inside */}
      <i className="ni ni-single-02" style={{ 
        fontSize: '12px', 
        position: 'absolute', 
        top: '4px', 
        left: '4px',
        color: 'inherit'
      }}></i>
    </div>
  );
};

export default UserManagementIcon; 