import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchAdminUsers, toggleUserStatus } from '../../store/adminSlice';

// MUI Icons & Modal Components
import SearchIcon from '@mui/icons-material/Search';
import LockIcon from '@mui/icons-material/Lock';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import InfoIcon from '@mui/icons-material/Info';
import ReportProblemIcon from '@mui/icons-material/ReportProblem';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';

import { formatName } from '../../utils/formatters';

const AdminUsersPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { users, usersLoading, error } = useSelector((state) => state.admin);

  const [roleFilter, setRoleFilter] = useState('');
  const [activeFilter, setActiveFilter] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  // Disable Confirmation Dialog
  const [toggleConfirmUser, setToggleConfirmUser] = useState(null);

  const loadData = () => {
    const params = {};
    if (roleFilter) params.role = roleFilter;
    if (activeFilter !== '') params.active = activeFilter === 'true';
    if (searchQuery) params.search = searchQuery;
    dispatch(fetchAdminUsers(params));
  };

  useEffect(() => {
    loadData();
  }, [dispatch, roleFilter, activeFilter]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    loadData();
  };

  const handleConfirmToggleStatus = async () => {
    if (!toggleConfirmUser) return;
    try {
      await dispatch(toggleUserStatus({ id: toggleConfirmUser.id, active: !toggleConfirmUser.active })).unwrap();
      setToggleConfirmUser(null);
      loadData();
    } catch (err) {
      alert(err || 'Failed to toggle account status');
    }
  };

  const getRoleChip = (role) => {
    switch (role) {
      case 'ADMIN':
        return <span className="status-chip chip-default" style={{ backgroundColor: '#F3E8FF', color: '#7E22CE', borderColor: '#E9D5FF' }}>ADMIN</span>;
      case 'COLLECTOR':
        return <span className="status-chip chip-requested">COLLECTOR</span>;
      case 'CUSTOMER':
      default:
        return <span className="status-chip chip-recycled">CUSTOMER</span>;
    }
  };

  return (
    <div className="dashboard-overview-wrapper">
      {/* Header Info */}
      <div>
        <h2 className="section-title" style={{ fontSize: '1.4rem', margin: 0 }}>User Directory & Account Controls</h2>
        <p style={{ color: '#64748B', fontSize: '0.9rem', margin: '4px 0 0 0' }}>
          Inspect user accounts, filter by system role, and enable or disable authentication access.
        </p>
      </div>

      {error && <Alert severity="error" sx={{ borderRadius: '12px' }}>{error}</Alert>}

      {/* Filter and Search Bar */}
      <div className="quick-actions-card">
        <form onSubmit={handleSearchSubmit} style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center' }}>
          <div style={{ flex: 1, minWidth: '240px', position: 'relative' }}>
            <input
              type="text"
              placeholder="Search by name, email, or phone..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 14px 10px 38px',
                borderRadius: '8px',
                border: '1.5px solid #CBD5E1',
                fontSize: '0.9rem',
              }}
            />
            <SearchIcon style={{ position: 'absolute', left: '10px', top: '10px', color: '#94A3B8', fontSize: '20px' }} />
          </div>

          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            style={{
              padding: '10px 14px',
              borderRadius: '8px',
              border: '1.5px solid #CBD5E1',
              fontSize: '0.9rem',
              backgroundColor: '#FFFFFF',
              color: '#0F172A',
              fontWeight: 600,
            }}
          >
            <option value="">All Roles</option>
            <option value="CUSTOMER">CUSTOMER</option>
            <option value="COLLECTOR">COLLECTOR</option>
            <option value="ADMIN">ADMIN</option>
          </select>

          <select
            value={activeFilter}
            onChange={(e) => setActiveFilter(e.target.value)}
            style={{
              padding: '10px 14px',
              borderRadius: '8px',
              border: '1.5px solid #CBD5E1',
              fontSize: '0.9rem',
              backgroundColor: '#FFFFFF',
              color: '#0F172A',
              fontWeight: 600,
            }}
          >
            <option value="">All Statuses</option>
            <option value="true">ACTIVE</option>
            <option value="false">DISABLED</option>
          </select>

          <button type="submit" className="btn-action-tile primary">
            Search
          </button>
        </form>
      </div>

      {/* Users Data Table */}
      <div className="recent-pickups-card">
        {usersLoading ? (
          <div className="loading-screen" style={{ minHeight: '30vh', backgroundColor: 'transparent' }}>
            <CircularProgress sx={{ color: '#395F51' }} />
          </div>
        ) : users.length === 0 ? (
          <div className="empty-table-state">
            <p>No users found matching the selected search criteria.</p>
          </div>
        ) : (
          <div className="table-responsive-container">
            <table className="custom-data-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>User Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Role</th>
                  <th>Status</th>
                  <th>Registered</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u.id} className="clickable-row" onClick={() => navigate(`/admin/users/${u.id}`)}>
                    <td className="font-semibold">#{u.id}</td>
                    <td className="font-semibold">{formatName(u.name)}</td>
                    <td>{u.email}</td>
                    <td>{u.phone || 'N/A'}</td>
                    <td>{getRoleChip(u.role)}</td>
                    <td>
                      <span className={`status-chip ${u.active ? 'chip-recycled' : 'chip-cancelled'}`}>
                        {u.active ? 'ACTIVE' : 'DISABLED'}
                      </span>
                    </td>
                    <td className="text-muted-xs">
                      {u.createdAt ? new Date(u.createdAt).toLocaleDateString() : 'N/A'}
                    </td>
                    <td style={{ textAlign: 'right' }} onClick={(e) => e.stopPropagation()}>
                      <div className="action-buttons-cell" style={{ justifyContent: 'flex-end', gap: '8px' }}>
                        <button
                          className="btn-table-action"
                          onClick={() => navigate(`/admin/users/${u.id}`)}
                          style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                        >
                          <InfoIcon fontSize="small" /> Details
                        </button>
                        <button
                          className={u.active ? 'btn-table-cancel' : 'btn-table-action'}
                          onClick={() => setToggleConfirmUser(u)}
                          style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                        >
                          {u.active ? <LockIcon fontSize="small" /> : <LockOpenIcon fontSize="small" />}
                          {u.active ? 'Disable' : 'Enable'}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Toggle Status Confirmation Dialog */}
      <Dialog
        open={Boolean(toggleConfirmUser)}
        onClose={() => setToggleConfirmUser(null)}
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
          <ReportProblemIcon style={{ color: toggleConfirmUser?.active ? '#DC2626' : '#059669', fontSize: '24px' }} />
          <span>Confirm Account Status Change</span>
        </DialogTitle>

        <DialogContent style={{ padding: '24px', backgroundColor: '#FFFFFF', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <p style={{ margin: 0, color: '#000000', fontSize: '0.95rem', lineHeight: 1.5 }}>
            Are you sure you want to <strong>{toggleConfirmUser?.active ? 'DISABLE' : 'ENABLE'}</strong> the account for{' '}
            <strong>{formatName(toggleConfirmUser?.name)}</strong> ({toggleConfirmUser?.email})?
          </p>

          {toggleConfirmUser?.active && (
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
          <button className="btn-action-tile secondary" onClick={() => setToggleConfirmUser(null)}>
            Cancel
          </button>
          <button
            onClick={handleConfirmToggleStatus}
            style={{
              backgroundColor: toggleConfirmUser?.active ? '#DC2626' : '#395F51',
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
              e.currentTarget.style.backgroundColor = toggleConfirmUser?.active ? '#B91C1C' : '#2D4B40';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = toggleConfirmUser?.active ? '#DC2626' : '#395F51';
            }}
          >
            Confirm {toggleConfirmUser?.active ? 'Disable' : 'Enable'}
          </button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default AdminUsersPage;
