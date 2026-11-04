import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAdminUserDetails, toggleUserStatus, clearCurrentUser } from '../../store/adminSlice';

// MUI Icons
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import PersonIcon from '@mui/icons-material/Person';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import LockIcon from '@mui/icons-material/Lock';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import DeleteSweepIcon from '@mui/icons-material/DeleteSweep';
import CheckCircleOutlinedIcon from '@mui/icons-material/CheckCircleOutlined';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import BadgeIcon from '@mui/icons-material/Badge';
import ReportProblemIcon from '@mui/icons-material/ReportProblem';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';

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
      {/* Back Navigation */}
      <div>
        <button className="btn-action-tile secondary" onClick={() => navigate('/admin/users')} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
          <ArrowBackIcon fontSize="small" /> Back to Users Directory
        </button>
      </div>

      {error && <Alert severity="error" sx={{ borderRadius: '12px' }}>{error}</Alert>}

      {/* Profile Header Card */}
      <div style={{
        backgroundColor: '#FFFFFF',
        border: '1.5px solid #CBD5E1',
        borderRadius: '12px',
        overflow: 'hidden',
      }}>
        {/* Green top accent bar */}
        <div style={{ height: '6px', backgroundColor: '#395F51' }} />

        <div style={{ padding: '24px 28px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '20px' }}>
          {/* Avatar + Name + Meta */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '18px' }}>
            <div style={{
              width: '64px', height: '64px', borderRadius: '50%',
              backgroundColor: '#395F51', color: '#FFFFFF',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexShrink: 0,
            }}>
              <PersonIcon style={{ fontSize: '34px' }} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                <h2 style={{ margin: 0, fontSize: '1.4rem', fontWeight: 800, color: '#0F172A' }}>
                  {formatName(u.name)}
                </h2>
                {getRoleChip(u.role)}
                <span className={`status-chip ${u.active ? 'chip-recycled' : 'chip-cancelled'}`} style={{ fontWeight: 700 }}>
                  {u.active ? 'ACTIVE' : 'DISABLED'}
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '20px', flexWrap: 'wrap', fontSize: '0.875rem', color: '#64748B' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <EmailIcon fontSize="small" style={{ color: '#395F51' }} /> {u.email}
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <PhoneIcon fontSize="small" style={{ color: '#395F51' }} /> {u.phone || 'No phone provided'}
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <CalendarTodayIcon fontSize="small" style={{ color: '#395F51' }} />
                  Joined {u.createdAt ? new Date(u.createdAt).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' }) : 'N/A'}
                </span>
              </div>
            </div>
          </div>

          {/* Action Button */}
          <button
            className={`btn-action-tile ${u.active ? 'outline' : 'primary'}`}
            onClick={() => setToggleConfirmOpen(true)}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', whiteSpace: 'nowrap' }}
          >
            {u.active ? <LockIcon fontSize="small" /> : <LockOpenIcon fontSize="small" />}
            {u.active ? 'Disable Account' : 'Enable Account'}
          </button>
        </div>
      </div>

      {/* Info Grid — 2 columns */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>

        {/* Account Details */}
        <div style={{ backgroundColor: '#FFFFFF', border: '1.5px solid #CBD5E1', borderRadius: '12px', overflow: 'hidden' }}>
          <div style={{ padding: '16px 20px', borderBottom: '1px solid #E2E8F0', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <BadgeIcon style={{ color: '#395F51', fontSize: '20px' }} />
            <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 700, color: '#0F172A' }}>Account Details</h3>
          </div>
          <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {[
              { label: 'User ID', value: `#${u.id}` },
              { label: 'Full Name', value: formatName(u.name) },
              { label: 'Email Address', value: u.email },
              { label: 'Phone Number', value: u.phone || 'N/A' },
              { label: 'Registered On', value: u.createdAt ? new Date(u.createdAt).toLocaleString() : 'N/A' },
            ].map(({ label, value }) => (
              <div key={label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px', borderBottom: '1px solid #F1F5F9', paddingBottom: '12px' }}>
                <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.4px', flexShrink: 0 }}>{label}</span>
                <span style={{ fontSize: '0.9rem', fontWeight: 700, color: '#0F172A', textAlign: 'right', wordBreak: 'break-all' }}>{value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Activity Summary */}
        <div style={{ backgroundColor: '#FFFFFF', border: '1.5px solid #CBD5E1', borderRadius: '12px', overflow: 'hidden' }}>
          <div style={{ padding: '16px 20px', borderBottom: '1px solid #E2E8F0', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <DeleteSweepIcon style={{ color: '#395F51', fontSize: '20px' }} />
            <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 700, color: '#0F172A' }}>Activity Summary</h3>
          </div>
          <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>

            {/* KPI row */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div style={{ backgroundColor: '#F8FAFC', border: '1.5px solid #E2E8F0', borderRadius: '10px', padding: '16px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.4px' }}>Total Pickups</span>
                <span style={{ fontSize: '1.8rem', fontWeight: 800, color: '#0F172A', lineHeight: 1.1 }}>{u.totalPickupsCount ?? 0}</span>
                <span style={{ fontSize: '0.75rem', color: '#94A3B8' }}>all requests</span>
              </div>
              <div style={{ backgroundColor: '#ECFDF5', border: '1.5px solid #A7F3D0', borderRadius: '10px', padding: '16px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#059669', textTransform: 'uppercase', letterSpacing: '0.4px' }}>Completed</span>
                <span style={{ fontSize: '1.8rem', fontWeight: 800, color: '#059669', lineHeight: 1.1 }}>{u.completedPickupsCount ?? 0}</span>
                <span style={{ fontSize: '0.75rem', color: '#6EE7B7' }}>recycled</span>
              </div>
            </div>

            {/* Collector-specific fields */}
            {u.role === 'COLLECTOR' && (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginTop: '4px' }}>
                <div style={{ backgroundColor: '#FFF7ED', border: '1.5px solid #FED7AA', borderRadius: '10px', padding: '16px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#D97706', textTransform: 'uppercase', letterSpacing: '0.4px' }}>Active Workload</span>
                  <span style={{ fontSize: '1.8rem', fontWeight: 800, color: '#D97706', lineHeight: 1.1 }}>{u.activeWorkload ?? 0}</span>
                  <span style={{ fontSize: '0.75rem', color: '#FBB974' }}>active pickups</span>
                </div>
                <div style={{ backgroundColor: '#F8FAFC', border: '1.5px solid #E2E8F0', borderRadius: '10px', padding: '16px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.4px' }}>Availability</span>
                  <span style={{ fontSize: '1rem', fontWeight: 800, color: '#0F172A', marginTop: '4px' }}>{u.availability || 'N/A'}</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Status Toggle Confirmation Modal */}
      {toggleConfirmOpen && (
        <div
          onClick={() => setToggleConfirmOpen(false)}
          style={{
            position: 'fixed', inset: 0,
            backgroundColor: 'rgba(15, 23, 42, 0.45)',
            backdropFilter: 'blur(2px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            zIndex: 1000,
            padding: '16px',
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              width: '100%', maxWidth: '440px',
              backgroundColor: '#FFFFFF',
              border: '1.5px solid #CBD5E1',
              borderRadius: '16px',
              overflow: 'hidden',
              boxShadow: '0 20px 60px -10px rgba(0,0,0,0.2)',
            }}
          >
            {/* Modal Header */}
            <div style={{
              padding: '18px 24px',
              backgroundColor: '#F8FAFC',
              borderBottom: '1.5px solid #E2E8F0',
              display: 'flex', alignItems: 'center', gap: '12px',
            }}>
              <div style={{
                width: '36px', height: '36px', borderRadius: '50%',
                backgroundColor: u.active ? '#FEE2E2' : '#DCFCE7',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0,
              }}>
                <ReportProblemIcon style={{ color: u.active ? '#DC2626' : '#059669', fontSize: '20px' }} />
              </div>
              <div>
                <p style={{ margin: 0, fontWeight: 800, fontSize: '1rem', color: '#0F172A' }}>
                  Confirm Account Status Change
                </p>
                <p style={{ margin: 0, fontSize: '0.78rem', color: '#64748B', marginTop: '2px' }}>
                  This action will {u.active ? 'disable' : 'enable'} access for this user
                </p>
              </div>
            </div>

            {/* Modal Body */}
            <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {/* User summary row */}
              <div style={{
                display: 'flex', alignItems: 'center', gap: '12px',
                padding: '12px 14px',
                backgroundColor: '#F8FAFC',
                border: '1.5px solid #E2E8F0',
                borderRadius: '10px',
              }}>
                <div style={{
                  width: '38px', height: '38px', borderRadius: '50%',
                  backgroundColor: '#395F51', color: '#FFFFFF',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '0.9rem', fontWeight: 800, flexShrink: 0,
                }}>
                  {u.name ? u.name.trim()[0].toUpperCase() : 'U'}
                </div>
                <div>
                  <p style={{ margin: 0, fontWeight: 700, fontSize: '0.9rem', color: '#0F172A' }}>{formatName(u.name)}</p>
                  <p style={{ margin: 0, fontSize: '0.78rem', color: '#64748B' }}>{u.email}</p>
                </div>
              </div>

              <p style={{ margin: 0, color: '#334155', fontSize: '0.9rem', lineHeight: 1.6 }}>
                Are you sure you want to{' '}
                <strong style={{ color: u.active ? '#DC2626' : '#059669' }}>
                  {u.active ? 'DISABLE' : 'ENABLE'}
                </strong>{' '}
                this account?
              </p>

              {u.active && (
                <div style={{
                  backgroundColor: '#FEF2F2',
                  border: '1.5px solid #FCA5A5',
                  borderRadius: '8px',
                  padding: '12px 14px',
                  display: 'flex', alignItems: 'flex-start', gap: '8px',
                }}>
                  <ReportProblemIcon style={{ color: '#DC2626', fontSize: '18px', marginTop: '1px', flexShrink: 0 }} />
                  <p style={{ margin: 0, color: '#991B1B', fontSize: '0.83rem', fontWeight: 600, lineHeight: 1.5 }}>
                    The user will be immediately blocked from logging in and performing any operations.
                  </p>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div style={{
              padding: '16px 24px',
              backgroundColor: '#F8FAFC',
              borderTop: '1.5px solid #E2E8F0',
              display: 'flex', justifyContent: 'flex-end', gap: '10px',
            }}>
              <button
                className="btn-action-tile secondary"
                onClick={() => setToggleConfirmOpen(false)}
              >
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
                onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = u.active ? '#B91C1C' : '#2D4B40'; }}
                onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = u.active ? '#DC2626' : '#395F51'; }}
              >
                <ReportProblemIcon fontSize="small" />
                Confirm {u.active ? 'Disable' : 'Enable'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminUserDetailsPage;
