import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAdminUserDetails, toggleUserStatus, clearCurrentUser } from '../../store/adminSlice';

// MUI Icons & Modals
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import PersonIcon from '@mui/icons-material/Person';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import LockIcon from '@mui/icons-material/Lock';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import DeleteSweepIcon from '@mui/icons-material/DeleteSweep';
import CheckCircleOutlinedIcon from '@mui/icons-material/CheckCircleOutlined';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import BadgeIcon from '@mui/icons-material/Badge';
import ReportProblemIcon from '@mui/icons-material/ReportProblem';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';

import { formatName } from '../../utils/formatters';

const AdminUserDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { currentUser, currentUserLoading, error } = useSelector((state) => state.admin);

  const [toggleConfirmOpen, setToggleConfirmOpen] = useState(false);

  useEffect(() => {
    if (id) {
      dispatch(fetchAdminUserDetails(id));
    }
    return () => {
      dispatch(clearCurrentUser());
    };
  }, [dispatch, id]);

  const handleConfirmToggleStatus = async () => {
    if (!currentUser) return;
    try {
      await dispatch(toggleUserStatus({ id: currentUser.id, active: !currentUser.active })).unwrap();
      setToggleConfirmOpen(false);
      dispatch(fetchAdminUserDetails(id));
    } catch (err) {
      alert(err || 'Failed to toggle user status');
    }
  };

  if (currentUserLoading && !currentUser) {
    return (
      <div className="loading-screen" style={{ minHeight: '50vh', backgroundColor: 'transparent' }}>
        <CircularProgress sx={{ color: '#395F51' }} size={48} />
      </div>
    );
  }

  if (!currentUser) {
    return (
      <div className="dashboard-overview-wrapper">
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <button className="btn-action-tile secondary" onClick={() => navigate('/admin/users')}>
            <ArrowBackIcon fontSize="small" /> Back to Users Directory
          </button>
        </div>
        <Alert severity="error" sx={{ borderRadius: '12px', marginTop: '16px' }}>
          {error || 'User details not found or failed to load.'}
        </Alert>
      </div>
    );
  }

  const u = currentUser;

  const getRoleChip = (role) => {
    switch (role) {
      case 'ADMIN':
        return <span className="status-chip chip-default" style={{ backgroundColor: '#F3E8FF', color: '#7E22CE', borderColor: '#E9D5FF', fontWeight: 800 }}>ADMIN</span>;
      case 'COLLECTOR':
        return <span className="status-chip chip-requested" style={{ fontWeight: 800 }}>COLLECTOR</span>;
      case 'CUSTOMER':
      default:
        return <span className="status-chip chip-recycled" style={{ fontWeight: 800 }}>CUSTOMER</span>;
    }
  };

  return (
    <div className="dashboard-overview-wrapper" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Top Header Navigation Bar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <button className="btn-action-tile secondary" onClick={() => navigate('/admin/users')}>
            <ArrowBackIcon fontSize="small" /> Back to Users Directory
          </button>
          <h2 className="section-title" style={{ margin: 0, fontSize: '1.4rem', color: '#000000' }}>
            User Profile Details #{u.id}
          </h2>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span className={`status-chip ${u.active ? 'chip-recycled' : 'chip-cancelled'}`} style={{ fontSize: '0.85rem', padding: '6px 14px', fontWeight: 800 }}>
            {u.active ? 'ACTIVE' : 'DISABLED'}
          </span>
          <button
            className={`btn-action-tile ${u.active ? 'outline' : 'primary'}`}
            onClick={() => setToggleConfirmOpen(true)}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
          >
            {u.active ? <LockIcon fontSize="small" /> : <LockOpenIcon fontSize="small" />}
            {u.active ? 'Disable Account' : 'Enable Account'}
          </button>
        </div>
      </div>

      {error && <Alert severity="error" sx={{ borderRadius: '12px' }}>{error}</Alert>}

      {/* Main Profile Overview Card */}
      <div className="quick-actions-card" style={{ border: '1.5px solid #CBD5E1', padding: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px', flexWrap: 'wrap' }}>
          <div style={{ width: '64px', height: '64px', borderRadius: '50%', backgroundColor: '#395F51', color: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <PersonIcon style={{ fontSize: '36px' }} />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', flex: 1, minWidth: '240px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
              <h2 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 800, color: '#000000' }}>
                {formatName(u.name)}
              </h2>
              {getRoleChip(u.role)}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap', fontSize: '0.875rem', color: '#64748B' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <EmailIcon fontSize="small" style={{ color: '#395F51' }} /> {u.email}
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <PhoneIcon fontSize="small" style={{ color: '#395F51' }} /> {u.phone || 'No phone provided'}
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <CalendarTodayIcon fontSize="small" style={{ color: '#395F51' }} /> Joined: {u.createdAt ? new Date(u.createdAt).toLocaleDateString() : 'N/A'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 2-Column Detailed Layout */}
      <div className="dashboard-grid-layout" style={{ gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
        {/* Left Column: Account Information */}
        <div className="quick-actions-card" style={{ border: '1.5px solid #CBD5E1', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', paddingBottom: '12px', borderBottom: '1px solid #E2E8F0' }}>
            <BadgeIcon style={{ color: '#395F51', fontSize: '24px' }} />
            <h3 className="section-title" style={{ margin: 0, color: '#000000', fontSize: '1.2rem' }}>
              Account Information
            </h3>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <div>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.5px' }}>USER ID</span>
              <p style={{ margin: '4px 0 0 0', fontSize: '1.05rem', fontWeight: 800, color: '#000000' }}>#{u.id}</p>
            </div>

            <div>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.5px' }}>SYSTEM ROLE</span>
              <div style={{ marginTop: '4px' }}>{getRoleChip(u.role)}</div>
            </div>

            <div style={{ gridColumn: 'span 2' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.5px' }}>FULL NAME</span>
              <p style={{ margin: '4px 0 0 0', fontSize: '1.05rem', fontWeight: 800, color: '#000000' }}>{formatName(u.name)}</p>
            </div>

            <div style={{ gridColumn: 'span 2' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.5px' }}>EMAIL ADDRESS</span>
              <p style={{ margin: '4px 0 0 0', fontSize: '1rem', fontWeight: 700, color: '#000000' }}>{u.email}</p>
            </div>

            <div>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.5px' }}>PHONE NUMBER</span>
              <p style={{ margin: '4px 0 0 0', fontSize: '1rem', fontWeight: 700, color: '#000000' }}>{u.phone || 'N/A'}</p>
            </div>

            <div>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.5px' }}>STATUS</span>
              <div style={{ marginTop: '4px' }}>
                <span className={`status-chip ${u.active ? 'chip-recycled' : 'chip-cancelled'}`} style={{ fontWeight: 800 }}>
                  {u.active ? 'ACTIVE' : 'DISABLED'}
                </span>
              </div>
            </div>

            <div style={{ gridColumn: 'span 2' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.5px' }}>REGISTRATION DATE</span>
              <p style={{ margin: '4px 0 0 0', fontSize: '0.95rem', fontWeight: 700, color: '#000000' }}>
                {u.createdAt ? new Date(u.createdAt).toLocaleString() : 'N/A'}
              </p>
            </div>
          </div>
        </div>

        {/* Right Column: Activity & Performance Summary */}
        <div className="quick-actions-card" style={{ border: '1.5px solid #CBD5E1', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', paddingBottom: '12px', borderBottom: '1px solid #E2E8F0' }}>
            <DeleteSweepIcon style={{ color: '#395F51', fontSize: '24px' }} />
            <h3 className="section-title" style={{ margin: 0, color: '#000000', fontSize: '1.2rem' }}>
              Activity & Performance Summary
            </h3>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {u.role === 'COLLECTOR' && (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div style={{ backgroundColor: '#F8FAFC', border: '1.5px solid #CBD5E1', borderRadius: '8px', padding: '16px' }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.5px' }}>COLLECTOR AVAILABILITY</span>
                  <p style={{ margin: '6px 0 0 0', fontSize: '1.1rem', fontWeight: 800, color: '#000000' }}>{u.availability || 'N/A'}</p>
                </div>

                <div style={{ backgroundColor: '#F8FAFC', border: '1.5px solid #CBD5E1', borderRadius: '8px', padding: '16px' }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.5px' }}>ACTIVE WORKLOAD</span>
                  <p style={{ margin: '6px 0 0 0', fontSize: '1.1rem', fontWeight: 800, color: '#D97706' }}>{u.activeWorkload ?? 0} active pickups</p>
                </div>
              </div>
            )}

            {/* KPI Tile 1: TOTAL PICKUPS */}
            <div className="stat-card" style={{ border: '1.5px solid #CBD5E1', padding: '16px', backgroundColor: '#FFFFFF', borderRadius: '10px' }}>
              <div className="stat-icon-box total" style={{ width: '48px', height: '48px' }}>
                <DeleteSweepIcon fontSize="medium" />
              </div>
              <div className="stat-details">
                <span className="stat-label" style={{ fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>TOTAL PICKUPS</span>
                <span className="stat-value" style={{ fontSize: '1.6rem', color: '#000000' }}>{u.totalPickupsCount ?? 0}</span>
                <span className="text-muted-xs" style={{ color: '#64748B', marginTop: '2px' }}>Total waste pickup requests associated with account</span>
              </div>
            </div>

            {/* KPI Tile 2: COMPLETED / RECYCLED */}
            <div className="stat-card" style={{ border: '1.5px solid #CBD5E1', padding: '16px', backgroundColor: '#FFFFFF', borderRadius: '10px' }}>
              <div className="stat-icon-box completed" style={{ width: '48px', height: '48px' }}>
                <CheckCircleOutlinedIcon fontSize="medium" />
              </div>
              <div className="stat-details">
                <span className="stat-label" style={{ fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>COMPLETED / RECYCLED</span>
                <span className="stat-value" style={{ fontSize: '1.6rem', color: '#395F51' }}>{u.completedPickupsCount ?? 0}</span>
                <span className="text-muted-xs" style={{ color: '#059669', marginTop: '2px', fontWeight: 600 }}>Successfully collected & processed waste</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Status Toggle Confirmation Modal */}
      <Dialog
        open={toggleConfirmOpen}
        onClose={() => setToggleConfirmOpen(false)}
        maxWidth="xs"
        fullWidth
        PaperProps={{
          style: {
            borderRadius: '16px',
            border: '1.5px solid #CBD5E1',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.15)',
            overflow: 'hidden',
          },
        }}
      >
        <DialogTitle
          style={{
            fontWeight: 800,
            color: '#000000',
            backgroundColor: '#F8FAFC',
            borderBottom: '1.5px solid #CBD5E1',
            padding: '18px 24px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
          }}
        >
          <ReportProblemIcon style={{ color: u.active ? '#DC2626' : '#059669', fontSize: '24px' }} />
          <span>Confirm Account Status Change</span>
        </DialogTitle>

        <DialogContent style={{ padding: '24px', backgroundColor: '#FFFFFF', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <p style={{ margin: 0, color: '#000000', fontSize: '0.95rem', lineHeight: 1.5 }}>
            Are you sure you want to <strong>{u.active ? 'DISABLE' : 'ENABLE'}</strong> the account for{' '}
            <strong>{formatName(u.name)}</strong> ({u.email})?
          </p>

          {u.active && (
            <div
              style={{
                backgroundColor: '#FEF2F2',
                border: '1.5px solid #FCA5A5',
                borderRadius: '8px',
                padding: '12px 14px',
                color: '#991B1B',
                fontSize: '0.85rem',
                fontWeight: 600,
                lineHeight: 1.4,
              }}
            >
              Disabled users will be blocked from authenticating and performing operations.
            </div>
          )}
        </DialogContent>

        <DialogActions style={{ padding: '16px 24px', backgroundColor: '#F8FAFC', borderTop: '1.5px solid #CBD5E1', justifyContent: 'flex-end', gap: '12px' }}>
          <button className="btn-action-tile secondary" onClick={() => setToggleConfirmOpen(false)}>
            Cancel
          </button>
          <button
            onClick={handleConfirmToggleStatus}
            style={{
              backgroundColor: u.active ? '#DC2626' : '#395F51',
              color: '#FFFFFF',
              border: 'none',
              borderRadius: '8px',
              padding: '10px 20px',
              fontSize: '0.9rem',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              transition: 'background-color 0.2s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = u.active ? '#B91C1C' : '#2D4B40';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = u.active ? '#DC2626' : '#395F51';
            }}
          >
            Confirm {u.active ? 'Disable' : 'Enable'}
          </button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default AdminUserDetailsPage;
