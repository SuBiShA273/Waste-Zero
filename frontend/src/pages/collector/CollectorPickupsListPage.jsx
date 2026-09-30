import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  fetchAssignedPickups,
  acceptPickupThunk,
  rejectPickupThunk,
  updatePickupStatusThunk,
  clearActionMessage,
} from '../../store/collectorSlice';
import AssignmentIcon from '@mui/icons-material/Assignment';
import CircularProgress from '@mui/material/CircularProgress';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Alert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';
import { formatName, formatCategory, formatStatus, formatDateTime } from '../../utils/formatters';

const CollectorPickupsListPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { pickups, loading, updating, actionMessage } = useSelector((state) => state.collector);

  const [activeFilter, setActiveFilter] = useState('ALL');
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
  const [selectedPickupId, setSelectedPickupId] = useState(null);
  const [rejectReason, setRejectReason] = useState('');
  const [toastOpen, setToastOpen] = useState(false);

  useEffect(() => {
    dispatch(fetchAssignedPickups(activeFilter));
  }, [dispatch, activeFilter]);

  useEffect(() => {
    if (actionMessage) {
      setToastOpen(true);
    }
  }, [actionMessage]);

  const handleToastClose = () => {
    setToastOpen(false);
    dispatch(clearActionMessage());
  };

  const handleFilterChange = (filterKey) => {
    setActiveFilter(filterKey);
  };

  const handleAccept = (id) => {
    dispatch(acceptPickupThunk(id)).then(() => {
      dispatch(fetchAssignedPickups(activeFilter));
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
        dispatch(fetchAssignedPickups(activeFilter));
        setRejectDialogOpen(false);
        setSelectedPickupId(null);
      });
    }
  };

  const handleUpdateStatus = (id, newStatus) => {
    dispatch(updatePickupStatusThunk({ id, status: newStatus })).then(() => {
      dispatch(fetchAssignedPickups(activeFilter));
    });
  };

  const getStatusChipClass = (status) => {
    switch (status) {
      case 'REQUESTED':
        return 'chip-requested';
      case 'ASSIGNED':
      case 'ACCEPTED':
      case 'ON_THE_WAY':
      case 'ARRIVED':
        return 'chip-active';
      case 'COLLECTED':
      case 'RECYCLED':
        return 'chip-recycled';
      case 'REJECTED':
      case 'CANCELLED':
        return 'chip-cancelled';
      default:
        return 'chip-default';
    }
  };

  const filterTabs = [
    { key: 'ALL', label: 'All Assigned' },
    { key: 'ASSIGNED', label: 'Pending Acceptance' },
    { key: 'ACTIVE', label: 'Active / En Route' },
  ];

  return (
    <div className="pickups-list-page-wrapper">
      {/* Top Header Bar */}
      <div className="pickups-header-bar">
        <div>
          <h2>Assigned Waste Pickups</h2>
          <p className="subtitle">
            Review, accept, and update operational pickup routes assigned to your account.
          </p>
        </div>
      </div>

      {/* Filter Tabs Bar */}
      <div className="filter-tabs-bar">
        {filterTabs.map((tab) => (
          <button
            key={tab.key}
            className={`tab-btn ${activeFilter === tab.key ? 'active' : ''}`}
            onClick={() => handleFilterChange(tab.key)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Table Card */}
      <div className="table-card">
        {loading ? (
          <div className="card-loading-state">
            <CircularProgress sx={{ color: '#395F51' }} size={36} />
            <span>Loading assigned pickups...</span>
          </div>
        ) : pickups.length === 0 ? (
          <div className="empty-history-state" style={{ padding: '48px', textAlign: 'center' }}>
            <AssignmentIcon style={{ fontSize: '48px', color: '#94A3B8', marginBottom: '12px' }} />
            <h3>No Pickups Found</h3>
            <p>No pickups match the selected filter criteria.</p>
          </div>
        ) : (
          <div className="table-responsive-container">
            <table className="custom-data-table">
              <thead>
                <tr>
                  <th>Pickup ID</th>
                  <th>Waste Category</th>
                  <th>Customer Name</th>
                  <th>Pickup Address</th>
                  <th>Scheduled Slot</th>
                  <th>Status</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {pickups.map((item) => (
                  <tr
                    key={item.id}
                    className="clickable-row"
                    onClick={() => navigate(`/collector/pickups/${item.id}`)}
                  >
                    <td className="font-semibold">#WZ-{item.id}</td>
                    <td>{formatCategory(item.wasteCategory)}</td>
                    <td>
                      <div className="font-semibold">{formatName(item.customerName)}</div>
                      {item.customerPhone && (
                        <div className="text-muted-xs">📞 {item.customerPhone}</div>
                      )}
                    </td>
                    <td>
                      <div className="text-truncate-cell" style={{ maxWidth: '220px' }}>
                        {item.pickupAddress}
                      </div>
                    </td>
                    <td>
                      <div>{item.preferredDate}</div>
                      <div className="text-muted-xs">{item.preferredTime}</div>
                    </td>
                    <td>
                      <span className={`status-chip ${getStatusChipClass(item.status)}`}>
                        {formatStatus(item.status)}
                      </span>
                    </td>
                    <td style={{ textAlign: 'right' }} onClick={(e) => e.stopPropagation()}>
                      <div
                        style={{
                          display: 'flex',
                          justify: 'flex-end',
                          gap: '8px',
                          flexWrap: 'wrap',
                        }}
                      >
                        {(item.status === 'ASSIGNED' || item.status === 'REQUESTED') && (
                          <>
                            <button
                              className="btn-primary-action"
                              style={{ padding: '6px 14px', fontSize: '0.8rem' }}
                              onClick={() => handleAccept(item.id)}
                              disabled={updating}
                            >
                              Accept
                            </button>
                            <button
                              className="btn-danger-outline"
                              style={{ padding: '6px 12px', fontSize: '0.8rem' }}
                              onClick={() => handleOpenReject(item.id)}
                              disabled={updating}
                            >
                              Reject
                            </button>
                          </>
                        )}

                        {item.status === 'ACCEPTED' && (
                          <button
                            className="btn-primary-action"
                            style={{ padding: '6px 14px', fontSize: '0.8rem' }}
                            onClick={() => handleUpdateStatus(item.id, 'ON_THE_WAY')}
                            disabled={updating}
                          >
                            Start Route
                          </button>
                        )}

                        {item.status === 'ON_THE_WAY' && (
                          <button
                            className="btn-primary-action"
                            style={{
                              padding: '6px 14px',
                              fontSize: '0.8rem',
                              backgroundColor: '#2563EB',
                              borderColor: '#2563EB',
                            }}
                            onClick={() => handleUpdateStatus(item.id, 'ARRIVED')}
                            disabled={updating}
                          >
                            Mark Arrived
                          </button>
                        )}

                        {item.status === 'ARRIVED' && (
                          <button
                            className="btn-primary-action"
                            style={{
                              padding: '6px 14px',
                              fontSize: '0.8rem',
                              backgroundColor: '#059669',
                              borderColor: '#059669',
                            }}
                            onClick={() => navigate(`/collector/pickups/${item.id}`)}
                          >
                            Complete
                          </button>
                        )}

                        <button
                          className="btn-table-action"
                          onClick={() => navigate(`/collector/pickups/${item.id}`)}
                        >
                          View Details
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

      {/* Reject Reason Dialog */}
      <Dialog
        open={rejectDialogOpen}
        onClose={() => setRejectDialogOpen(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: '16px',
            border: '1.5px solid #FCA5A5',
            boxShadow: '0 25px 50px -12px rgba(220, 38, 38, 0.15)',
            overflow: 'hidden'
          }
        }}
      >
        <DialogTitle sx={{
          fontWeight: 800,
          color: '#991B1B',
          backgroundColor: '#FEF2F2',
          borderBottom: '1px solid #FEE2E2',
          padding: '20px 24px',
          display: 'flex',
          alignItems: 'center',
          gap: '10px'
        }}>
          <span style={{
            width: '32px',
            height: '32px',
            borderRadius: '50%',
            backgroundColor: '#FEE2E2',
            color: '#DC2626',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 800,
            fontSize: '1.1rem'
          }}>!</span>
          <span>Reject Pickup Assignment #{selectedPickupId}</span>
        </DialogTitle>

        <DialogContent sx={{ padding: '24px' }}>
          <p style={{ fontSize: '0.9rem', color: '#7F1D1D', backgroundColor: '#FEF2F2', border: '1px solid #FECACA', padding: '12px 14px', borderRadius: '8px', marginBottom: '16px' }}>
            <strong>Notice:</strong> Rejecting this assignment will decline the pickup request and trigger automatic smart reassignment to another eligible collector.
          </p>

          <TextField
            autoFocus
            fullWidth
            multiline
            rows={3}
            label="Rejection Reason (Optional)"
            placeholder="Please specify why you cannot take this assignment (e.g. out of service area, vehicle issue, schedule conflict)..."
            value={rejectReason}
            onChange={(e) => setRejectReason(e.target.value)}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: '10px',
                '&.Mui-focused fieldset': { borderColor: '#DC2626' }
              },
              '& .MuiInputLabel-root.Mui-focused': { color: '#DC2626' }
            }}
          />
        </DialogContent>

        <DialogActions sx={{ padding: '16px 24px', backgroundColor: '#FEF2F2', borderTop: '1px solid #FEE2E2' }}>
          <Button onClick={() => setRejectDialogOpen(false)} sx={{ color: '#64748B', fontWeight: 600 }}>
            Cancel
          </Button>
          <Button
            onClick={handleConfirmReject}
            variant="contained"
            disabled={updating}
            sx={{
              bgcolor: '#DC2626',
              '&:hover': { bgcolor: '#B91C1C' },
              fontWeight: 700,
              borderRadius: '8px',
              padding: '10px 22px',
              textTransform: 'none',
              boxShadow: '0 2px 4px rgba(220, 38, 38, 0.2)'
            }}
          >
            Confirm Rejection
          </Button>
        </DialogActions>
      </Dialog>

      {/* Toast Notification */}
      <Snackbar
        open={toastOpen}
        autoHideDuration={4000}
        onClose={handleToastClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert onClose={handleToastClose} severity="success" sx={{ width: '100%' }}>
          {actionMessage}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default CollectorPickupsListPage;
