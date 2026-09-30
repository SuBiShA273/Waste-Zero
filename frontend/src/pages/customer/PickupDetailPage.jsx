import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPickupById, cancelPickup, recyclePickup, clearCurrentPickup } from '../../store/pickupSlice';
import { useAuth } from '../../context/AuthContext';
import StatusTracker from '../../components/customer/StatusTracker';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import CategoryIcon from '@mui/icons-material/Category';
import PersonIcon from '@mui/icons-material/Person';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';
import RecyclingIcon from '@mui/icons-material/Recycling';
import ScaleIcon from '@mui/icons-material/Scale';
import Co2Icon from '@mui/icons-material/Co2';
import HistoryIcon from '@mui/icons-material/History';
import CircularProgress from '@mui/material/CircularProgress';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Alert from '@mui/material/Alert';
import { formatName, formatCategory, formatDateTime, getImageUrl } from '../../utils/formatters';

const PickupDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useAuth();

  const { currentPickup, loading, cancelling, recycling, error } = useSelector((state) => state.pickups);
  const [openCancelDialog, setOpenCancelDialog] = useState(false);
  const [openRecycleDialog, setOpenRecycleDialog] = useState(false);
  const [recyclingNotes, setRecyclingNotes] = useState('');

  const isAdmin = user?.role === 'ADMIN';

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

  const handleConfirmRecycle = async () => {
    if (id) {
      await dispatch(recyclePickup({ id, recyclingNotes }));
      setOpenRecycleDialog(false);
      dispatch(fetchPickupById(id));
    }
  };

  const getStatusChipClass = (status) => {
    switch (status) {
      case 'RECYCLED':
        return 'chip-recycled';
      case 'COLLECTED':
        return 'chip-active';
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
        <button className="btn-back-link mt-4" onClick={() => navigate(-1)}>
          <ArrowBackIcon fontSize="small" /> Back
        </button>
      </div>
    );
  }

  if (!currentPickup) {
    return (
      <div className="detail-page-error">
        <Alert severity="warning">Pickup request not found.</Alert>
        <button className="btn-back-link mt-4" onClick={() => navigate(-1)}>
          <ArrowBackIcon fontSize="small" /> Back
        </button>
      </div>
    );
  }

  return (
    <div className="pickup-detail-page-wrapper" style={{ maxWidth: '1100px', margin: '0 auto', padding: '10px 0 40px 0' }}>
      <button className="btn-back-link" onClick={() => navigate(-1)}>
        <ArrowBackIcon fontSize="small" /> Back
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

            {/* Admin Recycling Confirmation Button */}
            {isAdmin && currentPickup.status === 'COLLECTED' && (
              <Button
                variant="contained"
                startIcon={<RecyclingIcon />}
                onClick={() => setOpenRecycleDialog(true)}
                sx={{ bgcolor: '#059669', '&:hover': { bgcolor: '#047857' }, fontWeight: 700, borderRadius: '8px' }}
              >
                Confirm Recycling (Admin)
              </Button>
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
      <div className="detail-tracker-card" style={{ backgroundColor: '#FFFFFF', borderRadius: '16px', border: '1.5px solid #E2E8F0', padding: '24px', marginBottom: '24px' }}>
        <h3 className="section-title">Pickup Progress Lifecycle</h3>
        <StatusTracker status={currentPickup.status} />
      </div>

      {/* Collection & Recycling Info Card if Completed/Recycled */}
      {(currentPickup.status === 'COLLECTED' || currentPickup.status === 'RECYCLED') && (
        <div style={{ backgroundColor: '#F0FDF4', border: '1.5px solid #BBF7D0', borderRadius: '16px', padding: '24px', marginBottom: '24px' }}>
          <h3 style={{ margin: '0 0 16px 0', fontSize: '1.15rem', color: '#166534', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <RecyclingIcon /> Collection & Recycling Confirmation Details
          </h3>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', marginBottom: '16px' }}>
            <div style={{ backgroundColor: '#FFFFFF', padding: '14px', borderRadius: '10px', border: '1px solid #DCFCE7' }}>
              <span style={{ fontSize: '0.8rem', color: '#64748B', fontWeight: 600, display: 'block' }}>Actual Collected Weight</span>
              <span style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0F172A' }}>{currentPickup.actualWeight || 0} kg</span>
            </div>

            {currentPickup.status === 'RECYCLED' && (
              <div style={{ backgroundColor: '#FFFFFF', padding: '14px', borderRadius: '10px', border: '1px solid #DCFCE7' }}>
                <span style={{ fontSize: '0.8rem', color: '#64748B', fontWeight: 600, display: 'block' }}>Estimated CO₂e Saved</span>
                <span style={{ fontSize: '1.4rem', fontWeight: 800, color: '#395F51' }}>
                  {Math.round(((currentPickup.actualWeight || 0) * 1.5) * 100) / 100} kg CO₂e
                </span>
              </div>
            )}

            <div style={{ backgroundColor: '#FFFFFF', padding: '14px', borderRadius: '10px', border: '1px solid #DCFCE7' }}>
              <span style={{ fontSize: '0.8rem', color: '#64748B', fontWeight: 600, display: 'block' }}>Collection Timestamp</span>
              <span style={{ fontSize: '0.95rem', fontWeight: 700, color: '#334155' }}>
                {currentPickup.collectedAt ? formatDateTime(currentPickup.collectedAt) : 'Logged'}
              </span>
            </div>

            {currentPickup.recycledAt && (
              <div style={{ backgroundColor: '#FFFFFF', padding: '14px', borderRadius: '10px', border: '1px solid #DCFCE7' }}>
                <span style={{ fontSize: '0.8rem', color: '#64748B', fontWeight: 600, display: 'block' }}>Recycling Confirmation Date</span>
                <span style={{ fontSize: '0.95rem', fontWeight: 700, color: '#059669' }}>
                  {formatDateTime(currentPickup.recycledAt)}
                </span>
              </div>
            )}
          </div>

          {currentPickup.proofImageUrl && (
            <div style={{ marginTop: '16px' }}>
              <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#166534', display: 'block', marginBottom: '8px' }}>
                Collection Proof Photo
              </span>
              <img
                src={getImageUrl(currentPickup.proofImageUrl)}
                alt="Collection Proof"
                style={{ maxWidth: '300px', maxHeight: '200px', borderRadius: '10px', border: '1px solid #CBD5E1', objectFit: 'cover' }}
              />
            </div>
          )}

          {currentPickup.recyclingNotes && (
            <div style={{ marginTop: '12px', fontSize: '0.875rem', color: '#166534' }}>
              <strong>Admin Recycling Notes:</strong> {currentPickup.recyclingNotes}
            </div>
          )}
        </div>
      )}

      {/* Grid: Request Details + Customer Info */}
      <div className="detail-grid-layout" style={{ marginBottom: '24px' }}>
        {/* Left Card: Request Info */}
        <div className="detail-info-card">
          <h3 className="section-title">Collection Request Details</h3>

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
        </div>

        {/* Right Card: Contact Details */}
        <div className="detail-info-card">
          <h3 className="section-title">Customer & Collector Info</h3>

          <div className="contact-item">
            <div className="icon">
              <PersonIcon fontSize="small" />
            </div>
            <div className="contact-item-details">
              <span className="label">Customer Name</span>
              <span className="value">{formatName(currentPickup.customerName)}</span>
            </div>
          </div>

          <div className="collector-assignment-note">
            <h4 style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <PersonIcon fontSize="small" /> Assigned Collector
            </h4>
            {currentPickup.collectorName ? (
              <div style={{ marginTop: '8px', fontSize: '0.9rem', color: '#1E293B' }}>
                <p><strong>Name:</strong> {formatName(currentPickup.collectorName)}</p>
                {currentPickup.collectorPhone && <p><strong>Phone:</strong> {currentPickup.collectorPhone}</p>}
                {currentPickup.collectorServiceArea && <p><strong>Service Area:</strong> {currentPickup.collectorServiceArea}</p>}
              </div>
            ) : (
              <p style={{ marginTop: '6px', fontSize: '0.88rem', color: '#64748B' }}>
                {currentPickup.status === 'CANCELLED'
                  ? 'Request cancelled.'
                  : 'Searching for available collector...'}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Lifecycle Status Audit History Timeline */}
      {currentPickup.statusHistory && currentPickup.statusHistory.length > 0 && (
        <div style={{
          backgroundColor: '#FFFFFF',
          borderRadius: '12px',
          border: '1.5px solid #CBD5E1',
          padding: '24px',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.04)'
        }}>
          <h3 style={{
            margin: '0 0 20px 0',
            fontSize: '1.15rem',
            fontWeight: 800,
            color: '#0F172A',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <HistoryIcon style={{ color: '#395F51' }} /> Verified Status Transition Audit History
          </h3>

          <div style={{
            position: 'relative',
            paddingLeft: '28px',
            borderLeft: '2px solid #CBD5E1',
            marginLeft: '14px',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px'
          }}>
            {currentPickup.statusHistory.map((item, idx) => (
              <div
                key={item.id || idx}
                style={{
                  position: 'relative',
                  backgroundColor: '#F8FAFC',
                  border: '1px solid #E2E8F0',
                  borderRadius: '10px',
                  padding: '14px 18px',
                  boxShadow: '0 1px 2px rgba(0,0,0,0.02)'
                }}
              >
                {/* Timeline Bullet Indicator */}
                <div style={{
                  position: 'absolute',
                  left: '-35px',
                  top: '18px',
                  width: '14px',
                  height: '14px',
                  borderRadius: '50%',
                  backgroundColor: '#395F51',
                  border: '3px solid #FFFFFF',
                  boxShadow: '0 0 0 1px #CBD5E1'
                }} />

                {/* Header Line: Status + Timestamp */}
                <div style={{
                  display: 'flex',
                  justify: 'space-between',
                  alignItems: 'center',
                  marginBottom: '6px',
                  flexWrap: 'wrap',
                  gap: '8px'
                }}>
                  <span style={{
                    fontWeight: 800,
                    fontSize: '0.875rem',
                    color: '#0F172A',
                    backgroundColor: '#E2E8F0',
                    padding: '3px 10px',
                    borderRadius: '6px',
                    letterSpacing: '0.3px',
                    textTransform: 'uppercase'
                  }}>
                    {item.status}
                  </span>
                  <span style={{ fontSize: '0.8rem', color: '#64748B', fontWeight: 600 }}>
                    {formatDateTime(item.changedAt)}
                  </span>
                </div>

                {/* Changed By User */}
                {item.changedByName && (
                  <div style={{ fontSize: '0.825rem', color: '#475569', marginTop: '4px' }}>
                    Updated by: <strong style={{ color: '#0F172A', fontWeight: 700 }}>{formatName(item.changedByName)}</strong>
                  </div>
                )}

                {/* Notes */}
                {item.notes && (
                  <div style={{
                    marginTop: '8px',
                    paddingTop: '8px',
                    borderTop: '1px dashed #CBD5E1',
                    fontSize: '0.85rem',
                    color: '#334155',
                    lineHeight: 1.4
                  }}>
                    <span style={{ color: '#64748B', fontWeight: 600 }}>Note:</span> {item.notes}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Cancel Confirmation Dialog */}
      <Dialog
        open={openCancelDialog}
        onClose={() => setOpenCancelDialog(false)}
        PaperProps={{ sx: { borderRadius: '12px', padding: '8px', maxWidth: '420px', width: '100%' } }}
      >
        <DialogTitle sx={{ fontWeight: 700, color: '#1E293B' }}>Cancel Pickup Request?</DialogTitle>
        <DialogContent>
          <p style={{ color: '#475569', fontSize: '0.95rem' }}>
            Are you sure you want to cancel pickup request <strong>#WZ-{currentPickup.id}</strong>?
          </p>
        </DialogContent>
        <DialogActions sx={{ padding: '16px' }}>
          <Button onClick={() => setOpenCancelDialog(false)} disabled={cancelling} sx={{ color: '#64748B', fontWeight: 600 }}>
            Keep Pickup
          </Button>
          <Button onClick={handleConfirmCancel} disabled={cancelling} variant="contained" color="error" sx={{ borderRadius: '8px', fontWeight: 700 }}>
            {cancelling ? <CircularProgress size={20} color="inherit" /> : 'Yes, Cancel Request'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Admin Recycling Confirmation Modal */}
      <Dialog open={openRecycleDialog} onClose={() => setOpenRecycleDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 800, color: '#0F172A' }}>
          Confirm Recycling (Admin Authorization)
        </DialogTitle>
        <DialogContent dividers>
          <p style={{ margin: '0 0 16px 0', fontSize: '0.9rem', color: '#475569' }}>
            Transitioning pickup <strong>#WZ-{currentPickup.id}</strong> from <strong>COLLECTED</strong> to <strong>RECYCLED</strong>. This will finalize environmental impact calculations for the customer.
          </p>

          <TextField
            label="Recycling Notes (Optional)"
            fullWidth
            multiline
            rows={3}
            value={recyclingNotes}
            onChange={(e) => setRecyclingNotes(e.target.value)}
            placeholder="Add any processing center notes, sorting details, or recycling facility info..."
          />
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setOpenRecycleDialog(false)} disabled={recycling} sx={{ color: '#64748B' }}>
            Cancel
          </Button>
          <Button
            onClick={handleConfirmRecycle}
            variant="contained"
            disabled={recycling}
            sx={{ bgcolor: '#059669', '&:hover': { bgcolor: '#047857' }, fontWeight: 700 }}
          >
            {recycling ? <CircularProgress size={24} color="inherit" /> : 'Confirm RECYCLED'}
          </Button>
        </DialogActions>
      </Dialog>

    </div>
  );
};

export default PickupDetailPage;
