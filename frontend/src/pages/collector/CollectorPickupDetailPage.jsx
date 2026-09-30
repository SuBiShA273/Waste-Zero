import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchCollectorPickupById,
  acceptPickupThunk,
  rejectPickupThunk,
  updatePickupStatusThunk,
  completeCollectionThunk,
  uploadProofThunk,
  clearActionMessage,
  clearError,
} from '../../store/collectorSlice';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import NavigationIcon from '@mui/icons-material/Navigation';
import WhereToVoteIcon from '@mui/icons-material/WhereToVote';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import ScaleIcon from '@mui/icons-material/Scale';
import NotesIcon from '@mui/icons-material/Notes';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Alert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';

import StatusTracker from '../../components/customer/StatusTracker';
import CategoryIcon from '@mui/icons-material/Category';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PersonIcon from '@mui/icons-material/Person';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import CircularProgress from '@mui/material/CircularProgress';

import { formatName, formatCategory, formatStatus, formatDateTime } from '../../utils/formatters';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

const CollectorPickupDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { currentPickup, loading, updating, uploading, error, actionMessage } = useSelector(
    (state) => state.collector
  );

  // Form states
  const [actualWeight, setActualWeight] = useState('');
  const [collectionNotes, setCollectionNotes] = useState('');
  const [weightError, setWeightError] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [filePreview, setFilePreview] = useState(null);
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [toastOpen, setToastOpen] = useState(false);

  useEffect(() => {
    if (id) {
      dispatch(fetchCollectorPickupById(id));
    }
  }, [dispatch, id]);

  useEffect(() => {
    if (actionMessage) {
      setToastOpen(true);
    }
  }, [actionMessage]);

  useEffect(() => {
    if (currentPickup?.actualWeight) {
      setActualWeight(currentPickup.actualWeight.toString());
    }
    if (currentPickup?.collectionNotes) {
      setCollectionNotes(currentPickup.collectionNotes);
    }
  }, [currentPickup]);

  const handleToastClose = () => {
    setToastOpen(false);
    dispatch(clearActionMessage());
  };

  const handleAccept = () => {
    dispatch(acceptPickupThunk(id));
  };

  const handleOpenReject = () => {
    setRejectReason('');
    setRejectDialogOpen(true);
  };

  const handleConfirmReject = () => {
    dispatch(rejectPickupThunk({ id, reason: rejectReason })).then((res) => {
      setRejectDialogOpen(false);
      if (!res.error) {
        navigate('/collector/pickups');
      }
    });
  };

  const handleUpdateStatus = (newStatus) => {
    dispatch(updatePickupStatusThunk({ id, status: newStatus }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        alert('Please select an image file (JPEG, PNG, WEBP)');
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        alert('File size must not exceed 5MB');
        return;
      }
      setSelectedFile(file);
      setFilePreview(URL.createObjectURL(file));
    }
  };

  const handleUploadProof = () => {
    if (selectedFile) {
      dispatch(uploadProofThunk({ id, file: selectedFile })).then((res) => {
        if (!res.error) {
          setSelectedFile(null);
        }
      });
    }
  };

  const handleCompleteCollection = (e) => {
    e.preventDefault();
    setWeightError('');

    if (!currentPickup?.proofImageUrl) {
      setWeightError('Collection proof photo upload is MANDATORY before finalizing collection. Please upload a photo proof first.');
      return;
    }

    const weightNum = parseFloat(actualWeight);
    if (isNaN(weightNum) || weightNum <= 0) {
      setWeightError('Actual weight must be a valid number greater than 0 kg');
      return;
    }

    dispatch(
      completeCollectionThunk({
        id,
        actualWeight: weightNum,
        collectionNotes: collectionNotes.trim(),
      })
    );
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
      case 'REJECTED':
        return 'chip-cancelled';
      default:
        return 'chip-default';
    }
  };

  if (loading && !currentPickup) {
    return (
      <div style={{ padding: '60px 20px', textAlign: 'center', color: '#64748B', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
        <CircularProgress sx={{ color: '#395F51' }} size={40} />
        <span style={{ fontWeight: 600 }}>Fetching pickup details...</span>
      </div>
    );
  }

  if ((error || !currentPickup) && !loading) {
    return (
      <div className="pickup-detail-page-wrapper">
        <button className="btn-back-link" onClick={() => navigate('/collector/pickups')}>
          <ArrowBackIcon fontSize="small" /> Back to My Pickups
        </button>
        <Alert severity="error" sx={{ marginTop: '20px' }}>
          {error || 'Pickup request not found or access denied.'}
        </Alert>
      </div>
    );
  }

  const isCompleted = currentPickup.status === 'COLLECTED' || currentPickup.status === 'RECYCLED';
  const isRejected = currentPickup.status === 'REJECTED';

  return (
    <div className="pickup-detail-page-wrapper">
      {/* Back button */}
      <button className="btn-back-link" onClick={() => navigate('/collector/pickups')}>
        <ArrowBackIcon fontSize="small" /> Back to My Pickups
      </button>

      {/* Main Header Banner Card */}
      <div className="detail-header-card">
        <div className="header-top-row">
          <div className="header-info">
            <div className="id-badge-tag">#WZ-{currentPickup.id}</div>
            <h2>
              <CategoryIcon fontSize="small" style={{ color: '#395F51' }} />
              {formatCategory(currentPickup.wasteCategory)} Collection
            </h2>
            <p className="created-time">
              Requested by <strong>{formatName(currentPickup.customerName)}</strong> • Submitted on {formatDateTime(currentPickup.createdAt)}
            </p>
          </div>

          <div className="header-actions" style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
            <span className={`status-chip ${getStatusChipClass(currentPickup.status)}`}>
              {formatStatus(currentPickup.status)}
            </span>

            {/* Accept / Reject actions if ASSIGNED / REQUESTED */}
            {(currentPickup.status === 'ASSIGNED' || currentPickup.status === 'REQUESTED') && (
              <div style={{ display: 'flex', gap: '10px' }}>
                <button
                  className="btn-primary"
                  onClick={handleAccept}
                  disabled={updating}
                  style={{ padding: '8px 20px', fontSize: '0.875rem' }}
                >
                  Accept Pickup
                </button>
                <button
                  className="btn-danger-outline"
                  onClick={handleOpenReject}
                  disabled={updating}
                  style={{ padding: '8px 16px', fontSize: '0.875rem' }}
                >
                  Reject
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Summary Details Grid Inside Header Card */}
        <div className="header-summary-grid">
          <div className="summary-item">
            <span className="summary-label">
              <CalendarTodayIcon fontSize="inherit" /> Scheduled Slot
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
              <PersonIcon fontSize="inherit" /> Customer Contact
            </span>
            <span className="summary-value">
              {formatName(currentPickup.customerName)} ({currentPickup.customerPhone || currentPickup.customerEmail || 'No phone'})
            </span>
          </div>
        </div>
      </div>

      {/* Global Error Banner */}
      {error && (
        <Alert severity="error" sx={{ marginBottom: '20px' }} onClose={() => dispatch(clearError())}>
          {error}
        </Alert>
      )}

      {/* Timeline Stepper Component matching Customer Dashboard */}
      {!isRejected && (
        <div className="detail-tracker-card" style={{ marginBottom: '24px' }}>
          <h3 className="section-title">Collection Route Progress Timeline</h3>
          <StatusTracker status={currentPickup.status} />
        </div>
      )}

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
            <span className="field-value">{currentPickup.description || 'No description provided.'}</span>
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
        </div>
      </div>

        {/* Stage Transition Control Buttons */}
        {currentPickup.status === 'ACCEPTED' && (
          <div style={{ marginTop: '20px', padding: '16px', backgroundColor: '#EFF6FF', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <strong style={{ color: '#1E40AF' }}>Status: ACCEPTED</strong>
              <p style={{ margin: '2px 0 0 0', fontSize: '0.85rem', color: '#3B82F6' }}>
                You have accepted this pickup. Click below when you start driving to the location.
              </p>
            </div>
            <button
              className="btn-primary"
              onClick={() => handleUpdateStatus('ON_THE_WAY')}
              disabled={updating}
              style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
            >
              <NavigationIcon fontSize="small" /> Start Route (On the way)
            </button>
          </div>
        )}

        {currentPickup.status === 'ON_THE_WAY' && (
          <div style={{ marginTop: '20px', padding: '16px', backgroundColor: '#EFF6FF', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <strong style={{ color: '#1E40AF' }}>Status: ON THE WAY</strong>
              <p style={{ margin: '2px 0 0 0', fontSize: '0.85rem', color: '#3B82F6' }}>
                En route to customer address. Click below when you arrive at the site.
              </p>
            </div>
            <button
              className="btn-primary"
              onClick={() => handleUpdateStatus('ARRIVED')}
              disabled={updating}
              style={{ backgroundColor: '#2563EB', display: 'flex', alignItems: 'center', gap: '6px' }}
            >
              <WhereToVoteIcon fontSize="small" /> Mark Arrived
            </button>
          </div>
        )}

        {/* Mandatory Proof Photo & Complete Collection Workflow (When status is ARRIVED) */}
        {currentPickup.status === 'ARRIVED' && (
          <div style={{ marginTop: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
            
            {/* Step 1: Mandatory Collection Proof Upload */}
            <div style={{ padding: '20px', backgroundColor: currentPickup.proofImageUrl ? '#F0FDF4' : '#FFFBEB', border: currentPickup.proofImageUrl ? '1px solid #BBF7D0' : '1.5px solid #FCD34D', borderRadius: '12px' }}>
              <h4 style={{ margin: '0 0 10px 0', color: currentPickup.proofImageUrl ? '#166534' : '#B45309', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <CloudUploadIcon /> Step 1: Upload Photo Proof of Waste Collection (Mandatory) *
              </h4>

              {currentPickup.proofImageUrl ? (
                <div>
                  <span style={{ display: 'inline-block', padding: '4px 12px', borderRadius: '20px', backgroundColor: '#DCFCE7', color: '#15803D', fontWeight: 700, fontSize: '0.85rem', marginBottom: '10px' }}>
                    ✓ Proof Photo Uploaded Successfully
                  </span>
                  <div>
                    <img
                      src={
                        currentPickup.proofImageUrl.startsWith('http')
                          ? currentPickup.proofImageUrl
                          : `${API_BASE_URL}${currentPickup.proofImageUrl}`
                      }
                      alt="Collection Proof"
                      style={{
                        maxWidth: '100%',
                        maxHeight: '220px',
                        borderRadius: '8px',
                        border: '1.5px solid #86EFAC',
                        objectFit: 'cover',
                        display: 'block',
                      }}
                    />
                  </div>
                </div>
              ) : (
                <div>
                  <p style={{ fontSize: '0.875rem', color: '#92400E', margin: '0 0 12px 0', fontWeight: 500 }}>
                    ⚠️ You must upload a photo proof of the collected waste before you can mark this pickup as complete.
                  </p>
                  <div className="file-upload-box">
                    <label htmlFor="proof-file-input" className="custom-file-upload-label">
                      <CloudUploadIcon fontSize="small" style={{ color: '#395F51' }} />
                      {selectedFile ? selectedFile.name : 'Choose Proof Photo File...'}
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      id="proof-file-input"
                      style={{ display: 'none' }}
                    />
                    {selectedFile && (
                      <button
                        type="button"
                        className="btn-upload-photo"
                        onClick={handleUploadProof}
                        disabled={uploading}
                      >
                        {uploading ? 'Uploading Photo...' : 'Upload Selected Photo'}
                      </button>
                    )}
                  </div>
                  {filePreview && (
                    <div style={{ marginTop: '12px' }}>
                      <p style={{ fontSize: '0.8rem', color: '#78350F', marginBottom: '4px', fontWeight: 600 }}>Selected Preview:</p>
                      <img
                        src={filePreview}
                        alt="Selected Preview"
                        style={{ height: '120px', borderRadius: '8px', border: '1.5px solid #FCD34D', objectFit: 'cover' }}
                      />
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Step 2: Weight Entry & Completion Form */}
            <div style={{ padding: '24px', backgroundColor: '#ECFDF5', border: '1px solid #A7F3D0', borderRadius: '12px', opacity: currentPickup.proofImageUrl ? 1 : 0.85 }}>
              <h3 style={{ margin: '0 0 16px 0', color: '#065F46', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <ScaleIcon /> Step 2: Complete Collection Entry
              </h3>

              {!currentPickup.proofImageUrl && (
                <Alert severity="warning" sx={{ marginBottom: '16px', fontWeight: 600 }}>
                  Photo proof upload is required before finalizing collection. Please complete Step 1 above first.
                </Alert>
              )}

              <form onSubmit={handleCompleteCollection}>
                <div style={{ marginBottom: '16px' }}>
                  <label className="field-label" style={{ display: 'block', color: '#065F46', marginBottom: '6px' }}>
                    Actual Collected Weight (kg) *
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    min="0.1"
                    placeholder="e.g. 12.5"
                    value={actualWeight}
                    onChange={(e) => {
                      setActualWeight(e.target.value);
                      setWeightError('');
                    }}
                    required
                    className={`custom-text-input ${weightError ? 'has-error' : ''}`}
                    style={{ backgroundColor: '#FFFFFF' }}
                  />
                  {weightError && (
                    <span className="field-error-text" style={{ marginTop: '4px', display: 'block' }}>
                      {weightError}
                    </span>
                  )}
                </div>

                <div style={{ marginBottom: '20px' }}>
                  <label className="field-label" style={{ display: 'block', color: '#065F46', marginBottom: '6px' }}>
                    Collection Notes (Optional)
                  </label>
                  <textarea
                    rows={3}
                    placeholder="e.g. Plastic waste sorted and collected in good condition."
                    value={collectionNotes}
                    onChange={(e) => setCollectionNotes(e.target.value)}
                    className="custom-textarea-input"
                    style={{ backgroundColor: '#FFFFFF' }}
                  />
                </div>

                <button
                  type="submit"
                  className="btn-finalize-collection"
                  disabled={updating || !currentPickup.proofImageUrl}
                >
                  <CheckCircleIcon /> Finalize & Mark Collected
                </button>
              </form>
            </div>
          </div>
        )}

        {/* Collection Proof Section for Completed Pickups */}
        {isCompleted && currentPickup.proofImageUrl && (
          <div style={{ marginTop: '24px', padding: '20px', backgroundColor: '#F8FAFC', borderRadius: '12px', border: '1px solid #E2E8F0' }}>
            <h4 style={{ margin: '0 0 12px 0', color: '#0F172A', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <CloudUploadIcon style={{ color: '#395F51' }} /> Collection Proof Photo
            </h4>
            <p style={{ fontSize: '0.85rem', color: '#166534', fontWeight: 600, marginBottom: '8px' }}>
              ✓ Collection proof image uploaded:
            </p>
            <img
              src={
                currentPickup.proofImageUrl.startsWith('http')
                  ? currentPickup.proofImageUrl
                  : `${API_BASE_URL}${currentPickup.proofImageUrl}`
              }
              alt="Collection Proof"
              style={{
                maxWidth: '100%',
                maxHeight: '300px',
                borderRadius: '8px',
                border: '1px solid #CBD5E1',
                objectFit: 'cover',
              }}
            />
          </div>
        )}

        {/* Completed Data Summary */}
        {isCompleted && (
          <div style={{ marginTop: '24px', padding: '20px', backgroundColor: '#F0FDF4', border: '1px solid #BBF7D0', borderRadius: '12px' }}>
            <h4 style={{ margin: '0 0 10px 0', color: '#166534', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <CheckCircleIcon style={{ color: '#166534' }} /> Collection Summary Record
            </h4>
            <p style={{ margin: '4px 0', color: '#14532D', fontSize: '0.95rem' }}>
              <strong>Actual Collected Weight:</strong> {currentPickup.actualWeight} kg
            </p>
            {currentPickup.collectionNotes && (
              <p style={{ margin: '4px 0', color: '#14532D', fontSize: '0.95rem' }}>
                <strong>Collector Notes:</strong> {currentPickup.collectionNotes}
              </p>
            )}
            {currentPickup.collectedAt && (
              <p style={{ margin: '4px 0', color: '#14532D', fontSize: '0.85rem' }}>
                <strong>Completed Timestamp:</strong> {new Date(currentPickup.collectedAt).toLocaleString()}
              </p>
            )}
          </div>
        )}

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
          <span>Reject Pickup Assignment #{id}</span>
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
      <Snackbar open={toastOpen} autoHideDuration={4000} onClose={handleToastClose} anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}>
        <Alert onClose={handleToastClose} severity="success" sx={{ width: '100%' }}>
          {actionMessage}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default CollectorPickupDetailPage;
