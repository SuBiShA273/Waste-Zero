import React from 'react';
import { useAuth } from '../context/AuthContext';
import AutorenewIcon from '@mui/icons-material/Autorenew';

const AdminDashboard = () => {
  const { user, logout } = useAuth();

  return (
    <div className="dashboard-container">
      <header className="dashboard-navbar admin">
        <div className="dashboard-logo">
          <AutorenewIcon fontSize="medium" />
          <span className="dashboard-logo-title">WasteZero | Admin Portal</span>
        </div>
        <button className="btn-logout" onClick={logout}>
          Logout
        </button>
      </header>

      <main className="dashboard-content">
        <div className="dashboard-card">
          <div className="dashboard-card-header">
            <h1 className="dashboard-user-title">Admin Dashboard - {user?.name}</h1>
            <span className="role-badge admin">{user?.role}</span>
          </div>

          <p className="dashboard-description">
            Administrator system access granted. User management & system analytics will be added in upcoming days.
          </p>

          <div className="dashboard-info-box">
            <p><strong>Email:</strong> {user?.email}</p>
            <p><strong>Role:</strong> {user?.role}</p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
