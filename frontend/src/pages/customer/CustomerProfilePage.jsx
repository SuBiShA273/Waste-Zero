import React from 'react';
import { useAuth } from '../../context/AuthContext';
import PersonOutlinedIcon from '@mui/icons-material/PersonOutlined';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import { formatName } from '../../utils/formatters';

const CustomerProfilePage = () => {
  const { user } = useAuth();

  return (
    <div className="profile-page-wrapper">
      <div className="profile-card">
        <div className="profile-header">
          <div className="profile-avatar-circle">
            <PersonOutlinedIcon fontSize="large" />
          </div>
          <div className="profile-title-group">
            <h2>{formatName(user?.name)}</h2>
            <span className="role-tag">{user?.role || 'CUSTOMER'}</span>
          </div>
        </div>

        <div className="profile-details-grid">
          <div className="profile-detail-item">
            <div className="icon"><PersonOutlinedIcon fontSize="small" /></div>
            <div className="profile-detail-details">
              <span className="label">Full Name</span>
              <span className="value">{formatName(user?.name)}</span>
            </div>
          </div>
          <div className="profile-detail-item">
            <div className="icon"><EmailIcon fontSize="small" /></div>
            <div className="profile-detail-details">
              <span className="label">Email Address</span>
              <span className="value">{user?.email}</span>
            </div>
          </div>

          <div className="profile-detail-item">
            <div className="icon"><PhoneIcon fontSize="small" /></div>
            <div className="profile-detail-details">
              <span className="label">Phone Number</span>
              <span className="value">{user?.phone || 'Not provided'}</span>
            </div>
          </div>

          <div className="profile-detail-item">
            <div className="icon"><VerifiedUserIcon fontSize="small" /></div>
            <div className="profile-detail-details">
              <span className="label">Account Status</span>
              <span className="value status-active">Active Customer Account</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerProfilePage;
