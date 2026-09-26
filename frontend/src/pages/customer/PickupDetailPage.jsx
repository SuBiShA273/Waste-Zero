import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPickupById, cancelPickup, clearCurrentPickup } from '../../store/pickupSlice';
import StatusTracker from '../../components/customer/StatusTracker';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import CategoryIcon from '@mui/icons-material/Category';
import PersonIcon from '@mui/icons-material/Person';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';
import CircularProgress from '@mui/material/CircularProgress';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import Alert from '@mui/material/Alert';

import { formatName, formatCategory, formatDateTime } from '../../utils/formatters';

const PickupDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { currentPickup, loading, cancelling, error } = useSelector((state) => state.pickups);
  const [openCancelDialog, setOpenCancelDialog] = useState(false);

  useEffect(() => {
    if (id) {
      dispatch(fetchPickupById(id));
    }
    return () => {
      dispatch(clearCurrentPickup());
    };
  }, [dispatch, id]);

  const handleConfirmCancel = async () => {
    if (id) {
      await dispatch(cancelPickup(id));
      setOpenCancelDialog(false);
      dispatch(fetchPickupById(id));
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

  if (loading && !currentPickup) {
    return (
      <div className="detail-page-loading">
        <CircularProgress sx={{ color: '#395F51' }} size={40} />
        <span>Fetching pickup details...</span>
      </div>
    );
  }

  if (error && !currentPickup) {
    return (
      <div className="detail-page-error">
        <Alert severity="error" className="error-alert">
          {error}
        </Alert>
        <button className="btn-back-link mt-4" onClick={() => navigate('/customer/pickups')}>
          <ArrowBackIcon fontSize="small" /> Back to My Pickups
        </button>
      </div>
    );
  }

  if (!currentPickup) {
    return (
      <div className="detail-page-error">
        <Alert severity="warning">Pickup request not found.</Alert>
        <button className="btn-back-link mt-4" onClick={() => navigate('/customer/pickups')}>
          <ArrowBackIcon fontSize="small" /> Back to My Pickups
        </button>
      </div>
    );
  }

  return (
    <div className="pickup-detail-page-wrapper">
      <button className="btn-back-link" onClick={() => navigate('/customer/pickups')}>
        <ArrowBackIcon fontSize="small" /> Back to My Pickups
      </button>

      {/* Main Header Banner Card */}
      <div className="detail-header-card">
        <div className="header-top-row">
          <div className="header-info">
            <div className="id-badge-tag">#WZ-{currentPickup.id}</div>
            <h2>
              <CategoryIcon fontSize="small" /> {formatCategory(currentPickup.wasteCategory)}
            </h2>
            <p className="created-time">
              Submitted on {formatDateTime(currentPickup.createdAt)}
            </p>
          </div>

          <div className="header-actions">
            <span className={`status-chip ${getStatusChipClass(currentPickup.status)}`}>
              {currentPickup.status}
            </span>
            {currentPickup.status === 'REQUESTED' && (
              <button
                className="btn-danger-outline"
                onClick={() => setOpenCancelDialog(true)}
              >
                Cancel Request
              </button>
            )}
          </div>
        </div>

        {/* Summary Details Grid Inside Header Card */}
        <div className="header-summary-grid">
          <div className="summary-item">
            <span className="summary-label">
              <CalendarTodayIcon fontSize="inherit" /> Scheduled Date & Time
            </span>
            <span className="summary-value">
              {currentPickup.preferredDate} ({currentPickup.preferredTime})
            </span>
          </div>

          <div className="summary-item">
            <span className="summary-label">
              <LocationOnIcon fontSize="inherit" /> Pickup Address
            </span>
            <span className="summary-value truncate-summary">
              {currentPickup.pickupAddress}
            </span>
          </div>

          <div className="summary-item">
            <span className="summary-label">
              <PersonIcon fontSize="inherit" /> Customer Name
            </span>
            <span className="summary-value">
              {formatName(currentPickup.customerName)}
            </span>
          </div>
        </div>
      </div>

      {error && (
        <Alert severity="error" className="page-alert-banner">
          {error}
        </Alert>
      )}

      {/* Status Tracker */}
      <div className="detail-tracker-card">
        <h3 className="section-title">Pickup Progress Timeline</h3>
        <StatusTracker status={currentPickup.status} />
      </div>

      {/* Grid: Request Details + Customer Info */}
      <div className="detail-grid-layout">
        {/* Left Card: Request Info */}
        <div className="detail-info-card">
          <h3 className="section-title">Collection Details</h3>

          <div className="detail-field-group">
            <span className="field-label">Waste Category</span>
            <span className="field-value font-semibold">
              {formatCategory(currentPickup.wasteCategory)}
            </span>
          </div>

          <div className="detail-field-group">
            <span className="field-label">Description & Waste Details</span>
            <span className="field-value">{currentPickup.description}</span>
          </div>

          <div className="detail-field-group">
            <span className="field-label"><LocationOnIcon fontSize="inherit" /> Pickup Address</span>
            <span className="field-value">{currentPickup.pickupAddress}</span>
          </div>

          <div className="detail-field-group">
            <span className="field-label"><CalendarTodayIcon fontSize="inherit" /> Preferred Date & Time</span>
            <span className="field-value font-semibold">
              {currentPickup.preferredDate} ({currentPickup.preferredTime})
            </span>
          </div>

          <div className="detail-field-group">
            <span className="field-label">Last Updated</span>
            <span className="field-value text-muted-sm">
              {formatDateTime(currentPickup.updatedAt)}
            </span>
          </div>
        </div>

        {/* Right Card: Contact Details */}
        <div className="detail-info-card">
          <h3 className="section-title">Customer Information</h3>

          <div className="contact-item">
            <div className="icon">
              <PersonIcon fontSize="small" />
            </div>
            <div className="contact-item-details">
              <span className="label">Customer Name</span>
              <span className="value">{formatName(currentPickup.customerName)}</span>
            </div>
          </div>

          <div className="contact-item">
            <div className="icon">
              <EmailIcon fontSize="small" />
            </div>
            <div className="contact-item-details">
              <span className="label">Email Address</span>
              <span className="value">{currentPickup.customerEmail || 'N/A'}</span>
            </div>
          </div>

          <div className="contact-item">
            <div className="icon">
              <PhoneIcon fontSize="small" />
            </div>
            <div className="contact-item-details">
              <span className="label">Contact Phone</span>
              <span className="value">{currentPickup.customerPhone || 'N/A'}</span>
            </div>
          </div>

          <div className="collector-assignment-note">
            <h4>Collector Assignment</h4>
            <p>
              Once a collector accepts your request, their contact and pickup arrival details will be displayed here.
            </p>
          </div>
        </div>
      </div>

      {/* Cancel Confirmation Dialog */}
      <Dialog
        open={openCancelDialog}
        onClose={() => setOpenCancelDialog(false)}
        PaperProps={{
          sx: { borderRadius: '12px', padding: '8px', maxWidth: '420px', width: '100%' },
        }}
      >
        <DialogTitle sx={{ fontWeight: 700, color: '#1E293B' }}>
          Cancel Pickup Request?
        </DialogTitle>
        <DialogContent>
          <p style={{ color: '#475569', fontSize: '0.95rem' }}>
            Are you sure you want to cancel pickup request <strong>#WZ-{currentPickup.id}</strong>? This action cannot be undone.
          </p>
        </DialogContent>
        <DialogActions sx={{ padding: '16px' }}>
          <Button
            onClick={() => setOpenCancelDialog(false)}
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

export default PickupDetailPage;
