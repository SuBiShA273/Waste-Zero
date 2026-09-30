import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  fetchCollectorStats,
  fetchAssignedPickups,
  acceptPickupThunk,
  rejectPickupThunk,
  updatePickupStatusThunk,
  clearActionMessage,
} from '../../store/collectorSlice';
import { useAuth } from '../../context/AuthContext';
import AssignmentIcon from '@mui/icons-material/Assignment';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import CheckCircleOutlinedIcon from '@mui/icons-material/CheckCircleOutlined';
import CircleIcon from '@mui/icons-material/Circle';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import NavigationIcon from '@mui/icons-material/Navigation';
import WhereToVoteIcon from '@mui/icons-material/WhereToVote';
import DoneAllIcon from '@mui/icons-material/DoneAll';
import PersonIcon from '@mui/icons-material/Person';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Alert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';
import { formatName, formatCategory } from '../../utils/formatters';

const CollectorDashboardOverview = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { stats, pickups, activePickup, loading, updating, actionMessage } = useSelector(
    (state) => state.collector
  );

  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
  const [selectedPickupId, setSelectedPickupId] = useState(null);
  const [rejectReason, setRejectReason] = useState('');
  const [toastOpen, setToastOpen] = useState(false);

  useEffect(() => {
    dispatch(fetchCollectorStats());
    dispatch(fetchAssignedPickups());
  }, [dispatch]);

  useEffect(() => {
    if (actionMessage) {
      setToastOpen(true);
    }
  }, [actionMessage]);

  const handleToastClose = () => {
    setToastOpen(false);
    dispatch(clearActionMessage());
  };

  const handleAccept = (id) => {
    dispatch(acceptPickupThunk(id)).then(() => {
      dispatch(fetchCollectorStats());
      dispatch(fetchAssignedPickups());
    });
  };

  const handleOpenReject = (id) => {
    setSelectedPickupId(id);
    setRejectReason('');
    setRejectDialogOpen(true);
  };

  const handleConfirmReject = () => {
    if (selectedPickupId) {
      dispatch(rejectPickupThunk({ id: selectedPickupId, reason: rejectReason })).then(() => {
        dispatch(fetchCollectorStats());
        dispatch(fetchAssignedPickups());
        setRejectDialogOpen(false);
        setSelectedPickupId(null);
      });
    }
  };

  const handleUpdateStatus = (id, newStatus) => {
    dispatch(updatePickupStatusThunk({ id, status: newStatus })).then(() => {
      dispatch(fetchCollectorStats());
    });
  };

  const getStatusChipClass = (status) => {
    switch (status) {
      case 'REQUESTED': return 'status-chip chip-requested';
      case 'ASSIGNED': return 'status-chip chip-active';
      case 'ACCEPTED': return 'status-chip chip-requested';
      case 'ON_THE_WAY': return 'status-chip chip-requested';
      case 'ARRIVED': return 'status-chip chip-recycled';
      case 'COLLECTED': return 'status-chip chip-recycled';
      case 'REJECTED': return 'status-chip chip-cancelled';
      default: return 'status-chip chip-default';
    }
  };

  const getAvailBadgeClass = (avail) => {
    switch (avail) {
      case 'AVAILABLE': return 'availability-badge available';
      case 'BUSY': return 'availability-badge busy';
      case 'OFFLINE': return 'availability-badge offline';
      default: return 'availability-badge available';
    }
  };

  const pendingAssigned = pickups.filter((p) => p.status === 'ASSIGNED' || p.status === 'REQUESTED');

  return (
    <div className="dashboard-overview-wrapper">
      {/* Welcome Banner */}
      <section className="welcome-banner-card">
        <div className="welcome-text">
          <h2>
            Welcome back, <span className="highlight-name">{formatName(user?.name)}</span>!
          </h2>
          <p>
            Service Zone: <strong>{user?.serviceArea || 'Zone 1'}</strong> • Review assigned pickups and manage your active waste collection routes.
          </p>
        </div>
      </section>

      {/* Summary Statistics Cards */}
      <section className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon-box pending">
            <AssignmentIcon />
          </div>
          <div className="stat-details">
            <span className="stat-label">Assigned Pickups</span>
            <span className="stat-value">{stats.assignedPickups}</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-box total">
            <LocalShippingIcon />
          </div>
          <div className="stat-details">
            <span className="stat-label">Active / En Route</span>
            <span className="stat-value">{stats.acceptedPickups}</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-box completed">
            <CheckCircleOutlinedIcon />
          </div>
          <div className="stat-details">
            <span className="stat-label">Completed Pickups</span>
            <span className="stat-value">{stats.completedPickups}</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-box" style={{ backgroundColor: '#F1F5F9', color: '#475569' }}>
            <PersonIcon />
          </div>
          <div className="stat-details">
            <span className="stat-label">Service Role</span>
            <span className="stat-value" style={{ fontSize: '1.1rem', marginTop: '4px' }}>Collector</span>
          </div>
        </div>
      </section>

      {/* Active Pickup Section */}
      <section className="active-pickup-container">
        <div className="section-title" style={{ marginBottom: '12px' }}>Active Pickup in Progress</div>

        {activePickup ? (
          <div className="active-pickup-card">
            <div className="active-card-header">
              <div className="header-badge-group">
                <span className="badge-active-tag">Active Route</span>
                <span className="badge-id-tag">#WZ-{activePickup.id}</span>
              </div>
              <span className={getStatusChipClass(activePickup.status)}>
                {activePickup.status}
              </span>
            </div>

            <div className="active-info-row">
              <div className="info-item">
                <span className="info-label"><PersonIcon style={{ fontSize: 14 }} /> Customer Name</span>
                <span className="info-value">{activePickup.customerName || 'Customer'}</span>
              </div>

              <div className="info-item">
                <span className="info-label"><LocationOnIcon style={{ fontSize: 14 }} /> Pickup Address</span>
                <span className="info-value text-truncate">{activePickup.pickupAddress}</span>
              </div>

              <div className="info-item">
                <span className="info-label"><CalendarTodayIcon style={{ fontSize: 14 }} /> Scheduled Slot</span>
                <span className="info-value">{activePickup.preferredDate} ({activePickup.preferredTime})</span>
              </div>
            </div>

            <div className="active-tracker-box" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
              <div>
                <span className="info-label">Category</span>
                <span className="font-semibold" style={{ fontSize: '1.05rem', color: '#395F51' }}>
                  {formatCategory(activePickup.wasteCategory)}
                </span>
              </div>

              <div className="actions-button-group">
                {activePickup.status === 'ACCEPTED' && (
                  <button
                    className="btn-action-tile primary"
                    onClick={() => handleUpdateStatus(activePickup.id, 'ON_THE_WAY')}
                    disabled={updating}
                  >
                    <NavigationIcon fontSize="small" /> Start Route (On the way)
                  </button>
                )}

                {activePickup.status === 'ON_THE_WAY' && (
                  <button
                    className="btn-action-tile primary"
                    style={{ backgroundColor: '#2563EB', borderColor: '#2563EB' }}
                    onClick={() => handleUpdateStatus(activePickup.id, 'ARRIVED')}
                    disabled={updating}
                  >
                    <WhereToVoteIcon fontSize="small" /> Mark Arrived
                  </button>
                )}

                {activePickup.status === 'ARRIVED' && (
                  <button
                    className="btn-action-tile primary"
                    style={{ backgroundColor: '#059669', borderColor: '#059669' }}
                    onClick={() => navigate(`/collector/pickups/${activePickup.id}`)}
                  >
                    <DoneAllIcon fontSize="small" /> Complete Collection
                  </button>
                )}

                <button
                  className="btn-action-tile secondary"
                  onClick={() => navigate(`/collector/pickups/${activePickup.id}`)}
                >
                  View Details
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="no-active-pickup-card">
            <LocalShippingIcon className="empty-pickup-icon" />
            <h3>No Active Pickup in Progress</h3>
            <p>Accept a pending assignment below to start your route.</p>
          </div>
        )}
      </section>

      {/* Pending Assigned Pickups Table Section */}
      <section className="recent-pickups-card">
        <div className="card-top-bar">
          <h3 className="section-title">Assigned Pickups Awaiting Response</h3>
          <button
            className="link-view-all"
            onClick={() => navigate('/collector/pickups')}
          >
            View All ({pickups.length}) →
          </button>
        </div>

        {pendingAssigned.length > 0 ? (
          <div className="table-responsive-container">
            <table className="custom-data-table">
              <thead>
                <tr>
                  <th>Pickup ID</th>
                  <th>Category</th>
                  <th>Customer & Address</th>
                  <th>Scheduled Date</th>
                  <th>Time Slot</th>
                  <th>Status</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {pendingAssigned.map((item) => (
                  <tr key={item.id} className="clickable-row" onClick={() => navigate(`/collector/pickups/${item.id}`)}>
                    <td className="font-semibold">#WZ-{item.id}</td>
                    <td>{formatCategory(item.wasteCategory)}</td>
                    <td>
                      <div className="font-semibold">{item.customerName || 'Customer'}</div>
                      <div className="text-muted-xs">{item.pickupAddress}</div>
                    </td>
                    <td>{item.preferredDate}</td>
                    <td>{item.preferredTime}</td>
                    <td>
                      <span className={getStatusChipClass(item.status)}>{item.status}</span>
                    </td>
                    <td style={{ textAlign: 'right' }} onClick={(e) => e.stopPropagation()}>
                      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                        <button
                          className="btn-action-tile primary"
                          style={{ padding: '6px 14px', fontSize: '0.8rem' }}
                          onClick={() => handleAccept(item.id)}
                          disabled={updating}
                        >
                          Accept
                        </button>
                        <button
                          className="btn-action-tile outline"
                          style={{ padding: '6px 12px', fontSize: '0.8rem' }}
                          onClick={() => handleOpenReject(item.id)}
                          disabled={updating}
                        >
                          Reject
                        </button>
                        <button
                          className="btn-action-tile secondary"
                          style={{ padding: '6px 12px', fontSize: '0.8rem' }}
                          onClick={() => navigate(`/collector/pickups/${item.id}`)}
                        >
                          Details
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="empty-table-state">
            <p>No pending assigned pickups requiring acceptance.</p>
          </div>
        )}
      </section>

      {/* Reject Reason Dialog */}
      <Dialog open={rejectDialogOpen} onClose={() => setRejectDialogOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ fontWeight: 700 }}>Reject Pickup Assignment #{selectedPickupId}</DialogTitle>
        <DialogContent>
          <p style={{ fontSize: '0.9rem', color: '#475569', marginBottom: '12px' }}>
            Please state reason for rejecting this pickup assignment (optional):
          </p>
          <TextField
            autoFocus
            fullWidth
            multiline
            rows={3}
            placeholder="e.g. Vehicle breakdown / Outside reachable zone"
            value={rejectReason}
            onChange={(e) => setRejectReason(e.target.value)}
          />
        </DialogContent>
        <DialogActions sx={{ padding: '16px 24px' }}>
          <Button onClick={() => setRejectDialogOpen(false)} sx={{ color: '#64748B' }}>
            Cancel
          </Button>
          <Button onClick={handleConfirmReject} variant="contained" color="error" disabled={updating}>
            Confirm Rejection
          </Button>
        </DialogActions>
      </Dialog>

      {/* Toast Notification */}
      <Snackbar open={toastOpen} autoHideDuration={4000} onClose={handleToastClose} anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}>
        <Alert onClose={handleToastClose} severity="success" sx={{ width: '100%' }}>
          {actionMessage}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default CollectorDashboardOverview;
