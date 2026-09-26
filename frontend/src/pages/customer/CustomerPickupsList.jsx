import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchMyPickups, cancelPickup } from '../../store/pickupSlice';
import AddCircleOutlinedIcon from '@mui/icons-material/AddCircleOutlined';
import CircularProgress from '@mui/material/CircularProgress';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import Alert from '@mui/material/Alert';

import { formatCategory } from '../../utils/formatters';

const CustomerPickupsList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { pickups, loading, cancelling, error } = useSelector((state) => state.pickups);

  const [filter, setFilter] = useState('ALL');
  const [selectedCancelId, setSelectedCancelId] = useState(null);

  useEffect(() => {
    dispatch(fetchMyPickups());
  }, [dispatch]);

  const handleOpenCancelDialog = (id, e) => {
    e.stopPropagation();
    setSelectedCancelId(id);
  };

  const handleConfirmCancel = async () => {
    if (selectedCancelId) {
      await dispatch(cancelPickup(selectedCancelId));
      setSelectedCancelId(null);
      dispatch(fetchMyPickups());
    }
  };

  const getStatusChipClass = (status) => {
    switch (status) {
      case 'RECYCLED':
      case 'COLLECTED':
        return 'chip-recycled';
      case 'REQUESTED':
        return 'chip-requested';
      case 'ASSIGNED':
      case 'ACCEPTED':
      case 'ON_THE_WAY':
      case 'ARRIVED':
        return 'chip-active';
      case 'CANCELLED':
        return 'chip-cancelled';
      default:
        return 'chip-default';
    }
  };

  const filteredPickups = pickups.filter((p) => {
    if (filter === 'ALL') return true;
    if (filter === 'ACTIVE') return ['REQUESTED', 'ASSIGNED', 'ACCEPTED', 'ON_THE_WAY', 'ARRIVED'].includes(p.status);
    if (filter === 'COMPLETED') return ['COLLECTED', 'RECYCLED'].includes(p.status);
    if (filter === 'CANCELLED') return p.status === 'CANCELLED';
    return true;
  });

  return (
    <div className="pickups-list-page-wrapper">
      {/* Top Controls Bar */}
      <div className="pickups-header-bar">
        <div>
          <h2>My Pickup History</h2>
          <p className="subtitle">View and manage all your waste collection requests.</p>
        </div>
        <button
          className="btn-primary-action"
          onClick={() => navigate('/customer/pickups/new')}
        >
          <AddCircleOutlinedIcon fontSize="small" />
          Request New Pickup
        </button>
      </div>

      {error && (
        <Alert severity="error" className="page-alert-banner">
          {error}
        </Alert>
      )}

      {/* Filter Tabs */}
      <div className="filter-tabs-bar">
        <button
          className={`tab-btn ${filter === 'ALL' ? 'active' : ''}`}
          onClick={() => setFilter('ALL')}
        >
          All ({pickups.length})
        </button>
        <button
          className={`tab-btn ${filter === 'ACTIVE' ? 'active' : ''}`}
          onClick={() => setFilter('ACTIVE')}
        >
          Active
        </button>
        <button
          className={`tab-btn ${filter === 'COMPLETED' ? 'active' : ''}`}
          onClick={() => setFilter('COMPLETED')}
        >
          Completed
        </button>
        <button
          className={`tab-btn ${filter === 'CANCELLED' ? 'active' : ''}`}
          onClick={() => setFilter('CANCELLED')}
        >
          Cancelled
        </button>
      </div>

      {/* Table Content */}
      <div className="table-card">
        {loading ? (
          <div className="card-loading-state">
            <CircularProgress sx={{ color: '#395F51' }} size={36} />
            <span>Loading pickup records...</span>
          </div>
        ) : filteredPickups.length === 0 ? (
          <div className="empty-history-state">
            <h3>No pickups found</h3>
            <p>You do not have any pickup requests matching the selected filter.</p>
            <button
              className="btn-primary-action"
              onClick={() => navigate('/customer/pickups/new')}
            >
              Request Pickup Now
            </button>
          </div>
        ) : (
          <div className="table-responsive-container">
            <table className="custom-data-table">
              <thead>
                <tr>
                  <th>Pickup ID</th>
                  <th>Category</th>
                  <th>Description</th>
                  <th>Pickup Address</th>
                  <th>Preferred Date & Time</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredPickups.map((pickup) => (
                  <tr
                    key={pickup.id}
                    className="clickable-row"
                    onClick={() => navigate(`/customer/pickups/${pickup.id}`)}
                  >
                    <td className="font-semibold">#WZ-{pickup.id}</td>
                    <td>{formatCategory(pickup.wasteCategory)}</td>
                    <td className="text-truncate-cell">{pickup.description}</td>
                    <td className="text-truncate-cell">{pickup.pickupAddress}</td>
                    <td>
                      {pickup.preferredDate} <br />
                      <span className="text-muted-xs">{pickup.preferredTime}</span>
                    </td>
                    <td>
                      <span className={`status-chip ${getStatusChipClass(pickup.status)}`}>
                        {pickup.status}
                      </span>
                    </td>
                    <td>
                      <div className="action-buttons-cell" onClick={(e) => e.stopPropagation()}>
                        <button
                          className="btn-table-action"
                          onClick={() => navigate(`/customer/pickups/${pickup.id}`)}
                        >
                          View
                        </button>
                        {pickup.status === 'REQUESTED' && (
                          <button
                            className="btn-table-cancel"
                            onClick={(e) => handleOpenCancelDialog(pickup.id, e)}
                          >
                            Cancel
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Cancel Confirmation Dialog */}
      <Dialog
        open={Boolean(selectedCancelId)}
        onClose={() => setSelectedCancelId(null)}
        PaperProps={{
          sx: { borderRadius: '12px', padding: '8px', maxWidth: '420px', width: '100%' },
        }}
      >
        <DialogTitle sx={{ fontWeight: 700, color: '#1E293B' }}>
          Cancel Pickup Request?
        </DialogTitle>
        <DialogContent>
          <p style={{ color: '#475569', fontSize: '0.95rem' }}>
            Are you sure you want to cancel pickup request <strong>#WZ-{selectedCancelId}</strong>? This action cannot be undone.
          </p>
        </DialogContent>
        <DialogActions sx={{ padding: '16px' }}>
          <Button
            onClick={() => setSelectedCancelId(null)}
            disabled={cancelling}
            sx={{ color: '#64748B', fontWeight: 600 }}
          >
            Keep Pickup
          </Button>
          <Button
            onClick={handleConfirmCancel}
            disabled={cancelling}
            variant="contained"
            color="error"
            sx={{ borderRadius: '8px', fontWeight: 700 }}
          >
            {cancelling ? <CircularProgress size={20} color="inherit" /> : 'Yes, Cancel Request'}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default CustomerPickupsList;
