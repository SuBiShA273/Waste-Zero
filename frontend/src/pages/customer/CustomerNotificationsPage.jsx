import React from 'react';
import NotificationsIcon from '@mui/icons-material/Notifications';

const CustomerNotificationsPage = () => {
  return (
    <div className="placeholder-page-wrapper">
      <div className="placeholder-card">
        <NotificationsIcon className="placeholder-icon" />
        <h2>Notifications Center</h2>
        <p>
          Stay updated on your scheduled pickups, collector status changes, and waste processing alerts.
        </p>
        <span className="planned-tag">Module Planned for Future Release</span>
      </div>
    </div>
  );
};

export default CustomerNotificationsPage;
