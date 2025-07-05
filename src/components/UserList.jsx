import React, { useEffect, useState } from 'react';
import ApiService from '../services/api';

const ROLE_LABELS = {
  admin: 'Admins',
  teacher: 'Teachers',
  student: 'Students',
};

const UserList = () => {
  const [role, setRole] = useState('admin');
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    ApiService.getUsersByRole(role)
      .then((data) => {
        console.log('API response for users:', data);
        // Try to handle various possible response formats
        if (Array.isArray(data)) {
          setUsers(data);
        } else if (Array.isArray(data.users)) {
          setUsers(data.users);
        } else if (Array.isArray(data.data)) {
          setUsers(data.data);
        } else {
          setUsers([]);
        }
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [role]);

  const renderTableRows = () => {
    return users.map((user) => (
      <tr key={user.id}>
        <td>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <img
              src={user.avatar || '/default-avatar.png'}
              alt={user.name}
              style={{ width: 40, height: 40, borderRadius: '50%', marginRight: 8 }}
            />
            <div>
              <div style={{ fontWeight: 600 }}>{user.name}</div>
              <div style={{ fontSize: 12, color: '#888' }}>ID: {user.id}</div>
            </div>
          </div>
        </td>
        <td>{user.email}</td>
        <td>
          {role === 'student'
            ? user['course_year_section'] || '-'
            : user['program'] || '-'}
        </td>
        <td>
          <span style={{
            color: user.status === 'ACTIVE' ? '#10b981' : '#a0aec0',
            fontWeight: 500,
          }}>
            {user.status}
          </span>
        </td>
        <td>{user.last_login || '-'}</td>
        <td>
          <button style={{ marginRight: 8, background: '#4f8cff', color: '#fff', border: 'none', borderRadius: 4, padding: '4px 12px' }}>Edit</button>
          <button style={{ background: '#ff4d4f', color: '#fff', border: 'none', borderRadius: 4, padding: '4px 12px' }}>Delete</button>
        </td>
      </tr>
    ));
  };

  return (
    <div style={{ background: '#fff', borderRadius: 8, padding: 24 }}>
      <div style={{ display: 'flex', gap: 16, marginBottom: 24 }}>
        {Object.keys(ROLE_LABELS).map((r) => (
          <button
            key={r}
            onClick={() => setRole(r)}
            style={{
              background: role === r ? '#2563eb' : '#f1f5f9',
              color: role === r ? '#fff' : '#222',
              border: 'none',
              borderRadius: 6,
              padding: '8px 24px',
              fontWeight: 600,
              fontSize: 16,
              cursor: 'pointer',
            }}
          >
            {ROLE_LABELS[r]}
          </button>
        ))}
      </div>
      {loading ? (
        <div>Loading...</div>
      ) : error ? (
        <div style={{ color: 'red' }}>{error}</div>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#f9fafb' }}>
              <th style={{ textAlign: 'left', padding: 8 }}>NAME</th>
              <th style={{ textAlign: 'left', padding: 8 }}>EMAIL</th>
              <th style={{ textAlign: 'left', padding: 8 }}>{role === 'student' ? 'COURSE/YEAR/SECTION' : 'PROGRAM'}</th>
              <th style={{ textAlign: 'left', padding: 8 }}>STATUS</th>
              <th style={{ textAlign: 'left', padding: 8 }}>LAST LOGIN</th>
              <th style={{ textAlign: 'left', padding: 8 }}>ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {renderTableRows()}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default UserList; 