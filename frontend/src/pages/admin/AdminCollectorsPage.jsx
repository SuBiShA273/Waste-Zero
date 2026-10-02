import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAdminCollectors, toggleUserStatus } from '../../store/adminSlice';

// MUI Icons & Modals
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import WorkIcon from '@mui/icons-material/Work';
import PowerSettingsNewIcon from '@mui/icons-material/PowerSettingsNew';
import LockIcon from '@mui/icons-material/Lock';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';

import { formatName } from '../../utils/formatters';

const AdminCollectorsPage = () => {
  const dispatch = useDispatch();
  const { collectors, collectorsLoading, error } = useSelector((state) => state.admin);

  const [toggleConfirmCollector, setToggleConfirmCollector] = useState(null);

  useEffect(() => {
    dispatch(fetchAdminCollectors());
  }, [dispatch]);

  const handleToggleStatus = async () => {
    if (!toggleConfirmCollector) return;
    try {
      await dispatch(toggleUserStatus({ id: toggleConfirmCollector.id, active: !toggleConfirmCollector.active })).unwrap();
      setToggleConfirmCollector(null);
      dispatch(fetchAdminCollectors());
    } catch (err) {
      alert(err || 'Failed to update collector status');
    }
  };

  const getAvailabilityBadge = (availability) => {
    switch (availability) {
      case 'AVAILABLE':
        return <span className="availability-badge available">AVAILABLE</span>;
      case 'BUSY':
        return <span className="availability-badge busy">BUSY</span>;
      case 'OFFLINE':
      default:
        return <span className="availability-badge offline">OFFLINE</span>;
    }
  };

  const totalCollectors = collectors.length;
  const availableCount = collectors.filter((c) => c.availability === 'AVAILABLE' && c.active).length;
  const busyCount = collectors.filter((c) => c.availability === 'BUSY' && c.active).length;
  const offlineCount = collectors.filter((c) => c.availability === 'OFFLINE' || !c.active).length;

  return (
    <div className="dashboard-overview-wrapper">
      {/* Page Header */}
      <div>
        <h2 className="section-title" style={{ fontSize: '1.4rem', margin: 0, color: '#000000' }}>Collector Monitoring & Workload</h2>
        <p style={{ color: '#64748B', fontSize: '0.9rem', margin: '4px 0 0 0' }}>
          Real-time availability status, active pickup workloads, and completed collection metrics for all collectors.
        </p>
      </div>

      {error && <Alert severity="error" sx={{ borderRadius: '12px' }}>{error}</Alert>}

      {/* Collector Overview KPI Cards */}
      <section className="stats-grid">
        <div className="stat-card" style={{ border: '1.5px solid #CBD5E1' }}>
          <div className="stat-icon-box total">
            <LocalShippingIcon />
          </div>
          <div className="stat-details">
            <span className="stat-label">Total Collectors</span>
            <span className="stat-value">{totalCollectors}</span>
            <span className="text-muted-xs">Registered on WasteZero</span>
          </div>
        </div>

        <div className="stat-card" style={{ border: '1.5px solid #CBD5E1' }}>
          <div className="stat-icon-box completed">
            <CheckCircleIcon />
          </div>
          <div className="stat-details">
            <span className="stat-label">Available</span>
            <span className="stat-value" style={{ color: '#059669' }}>{availableCount}</span>
            <span className="text-muted-xs" style={{ color: '#059669', fontWeight: 600 }}>Ready for assignment</span>
          </div>
        </div>

        <div className="stat-card" style={{ border: '1.5px solid #CBD5E1' }}>
          <div className="stat-icon-box pending">
            <WorkIcon />
          </div>
          <div className="stat-details">
            <span className="stat-label">Busy</span>
            <span className="stat-value" style={{ color: '#D97706' }}>{busyCount}</span>
            <span className="text-muted-xs" style={{ color: '#D97706', fontWeight: 600 }}>Handling active pickups</span>
          </div>
        </div>

        <div className="stat-card" style={{ border: '1.5px solid #CBD5E1' }}>
          <div className="stat-icon-box cancelled">
            <PowerSettingsNewIcon />
          </div>
          <div className="stat-details">
            <span className="stat-label">Offline / Disabled</span>
            <span className="stat-value" style={{ color: '#64748B' }}>{offlineCount}</span>
            <span className="text-muted-xs">Not eligible for assignment</span>
          </div>
        </div>
      </section>

      {/* Collectors Data Table */}
      <div className="recent-pickups-card" style={{ border: '1.5px solid #CBD5E1' }}>
        {collectorsLoading ? (
          <div className="loading-screen" style={{ minHeight: '30vh', backgroundColor: 'transparent' }}>
            <CircularProgress sx={{ color: '#395F51' }} />
          </div>
        ) : collectors.length === 0 ? (
          <div className="empty-table-state">
            <p>No waste collectors registered in the system.</p>
          </div>
        ) : (
          <div className="table-responsive-container">
            <table className="custom-data-table">
              <thead>
                <tr>
                  <th>Collector ID</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Account Status</th>
                  <th>Availability</th>
                  <th>Active Workload</th>
                  <th>Completed Pickups</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {collectors.map((c) => (
                  <tr key={c.id}>
                    <td className="font-semibold">#{c.id}</td>
                    <td className="font-semibold">{formatName(c.name)}</td>
                    <td>{c.email}</td>
                    <td>{c.phone || 'N/A'}</td>
                    <td>
                      <span className={`status-chip ${c.active ? 'chip-recycled' : 'chip-cancelled'}`}>
                        {c.active ? 'ACTIVE' : 'DISABLED'}
                      </span>
                    </td>
                    <td>{getAvailabilityBadge(c.availability)}</td>
                    <td className="font-semibold" style={{ color: c.activeWorkload > 0 ? '#D97706' : '#64748B' }}>
                      {c.activeWorkload} active
                    </td>
                    <td className="font-semibold" style={{ color: '#395F51' }}>
                      {c.completedPickupsCount} pickups
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <button
                        className={c.active ? 'btn-table-cancel' : 'btn-table-action'}
                        onClick={() => setToggleConfirmCollector(c)}
                        style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                      >
                        {c.active ? <LockIcon fontSize="small" /> : <LockOpenIcon fontSize="small" />}
                        {c.active ? 'Disable' : 'Enable'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Toggle Confirmation Dialog */}
      <Dialog
        open={Boolean(toggleConfirmCollector)}
        onClose={() => setToggleConfirmCollector(null)}
        PaperProps={{ style: { borderRadius: '12px' } }}
      >
        <DialogTitle sx={{ fontWeight: 800, color: '#0F172A' }}>Confirm Collector Account Toggle</DialogTitle>
        <DialogContent dividers>
          <p style={{ margin: 0, color: '#334155' }}>
            Are you sure you want to <strong>{toggleConfirmCollector?.active ? 'DISABLE' : 'ENABLE'}</strong> the collector account for{' '}
            <strong>{toggleConfirmCollector?.name}</strong> ({toggleConfirmCollector?.email})?
          </p>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <button className="btn-action-tile secondary" onClick={() => setToggleConfirmCollector(null)}>
            Cancel
          </button>
          <button
            className={`btn-action-tile ${toggleConfirmCollector?.active ? 'outline' : 'primary'}`}
            onClick={handleToggleStatus}
          >
            Confirm {toggleConfirmCollector?.active ? 'Disable' : 'Enable'}
          </button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default AdminCollectorsPage;
