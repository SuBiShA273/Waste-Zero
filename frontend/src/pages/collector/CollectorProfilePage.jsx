import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useSelector } from 'react-redux';
import PersonOutlinedIcon from '@mui/icons-material/PersonOutlined';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import CircleIcon from '@mui/icons-material/Circle';
import { formatName } from '../../utils/formatters';

const CollectorProfilePage = () => {
  const { user } = useAuth();
  const { stats } = useSelector((state) => state.collector);

  const currentAvailability = stats?.availability || user?.availability || 'AVAILABLE';

  const getAvailColor = (status) => {
    switch (status) {
      case 'AVAILABLE': return '#10B981';
      case 'BUSY': return '#F59E0B';
      case 'OFFLINE': return '#6B7280';
      default: return '#10B981';
    }
  };

  return (
    <div className="profile-page-wrapper">
      <div className="profile-card">
        {/* Profile Header */}
        <div className="profile-header">
          <div className="profile-avatar-circle">
            <PersonOutlinedIcon fontSize="large" />
          </div>
          <div className="profile-title-group">
            <h2>{formatName(user?.name)}</h2>
            <span className="role-tag" style={{ backgroundColor: '#ECFDF5', color: '#047857', borderColor: '#A7F3D0' }}>
              {user?.role || 'COLLECTOR'}
            </span>
          </div>
        </div>

        {/* Profile Details Grid */}
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
            <div className="icon"><LocationOnIcon fontSize="small" /></div>
            <div className="profile-detail-details">
              <span className="label">Assigned Service Area</span>
              <span className="value" style={{ color: '#395F51', fontWeight: 700 }}>
                {user?.serviceArea || 'Zone 1'}
              </span>
            </div>
          </div>

          <div className="profile-detail-item">
            <div className="icon">
              <CircleIcon fontSize="small" style={{ color: getAvailColor(currentAvailability) }} />
            </div>
            <div className="profile-detail-details">
              <span className="label">Current Operational Status</span>
              <span className="value" style={{ color: getAvailColor(currentAvailability), fontWeight: 700 }}>
                {currentAvailability} {currentAvailability === 'BUSY' ? '(Handling Active Route)' : '(Ready for Pickups)'}
              </span>
            </div>
          </div>

          <div className="profile-detail-item">
            <div className="icon"><VerifiedUserIcon fontSize="small" /></div>
            <div className="profile-detail-details">
              <span className="label">Account Status</span>
              <span className="value status-active">Active Collector Account</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CollectorProfilePage;
