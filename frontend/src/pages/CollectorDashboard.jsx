import React from 'react';
import { useAuth } from '../context/AuthContext';
import AutorenewIcon from '@mui/icons-material/Autorenew';

const CollectorDashboard = () => {
  const { user, logout } = useAuth();

  return (
    <div className="dashboard-container">
      <header className="dashboard-navbar collector">
        <div className="dashboard-logo">
          <AutorenewIcon fontSize="medium" />
          <span className="dashboard-logo-title">WasteZero | Collector Portal</span>
        </div>
        <button className="btn-logout" onClick={logout}>
          Logout
        </button>
      </header>

      <main className="dashboard-content">
        <div className="dashboard-card">
          <div className="dashboard-card-header">
            <h1 className="dashboard-user-title">Welcome, Collector {user?.name}!</h1>
            <span className="role-badge collector">{user?.role}</span>
          </div>

          <p className="dashboard-description">
            Collector Portal authorization verified. Pickup assignment tools will be activated in upcoming days.
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

export default CollectorDashboard;
