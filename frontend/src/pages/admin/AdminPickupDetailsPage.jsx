import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAdminPickupDetails, recyclePickup, clearCurrentPickup } from '../../store/adminSlice';

// MUI Icons & Modals
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import PersonIcon from '@mui/icons-material/Person';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import DeleteSweepIcon from '@mui/icons-material/DeleteSweep';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import RecyclingIcon from '@mui/icons-material/Recycling';
import TimelineIcon from '@mui/icons-material/Timeline';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';

import { formatName, formatCategory } from '../../utils/formatters';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

const AdminPickupDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { currentPickup, currentPickupLoading, error, actionLoading } = useSelector((state) => state.admin);

  const [recycleOpen, setRecycleOpen] = useState(false);
  const [recyclingNotes, setRecyclingNotes] = useState('');
  const [proofImageModalOpen, setProofImageModalOpen] = useState(false);

  useEffect(() => {
    if (id) {
      dispatch(fetchAdminPickupDetails(id));
    }
    return () => {
      dispatch(clearCurrentPickup());
    };
  }, [dispatch, id]);

  const handleConfirmRecycle = async () => {
    try {
      await dispatch(recyclePickup({ id, notes: recyclingNotes })).unwrap();
      setRecycleOpen(false);
      setRecyclingNotes('');
      dispatch(fetchAdminPickupDetails(id));
    } catch (err) {
      alert(err || 'Failed to recycle pickup');
    }
  };

  if (currentPickupLoading || !currentPickup) {
    return (
      <div className="loading-screen" style={{ minHeight: '50vh', backgroundColor: 'transparent' }}>
        <CircularProgress sx={{ color: '#395F51' }} size={48} />
      </div>
    );
  }

  const p = currentPickup;

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

  return (
    <div className="dashboard-overview-wrapper">
      {/* Action Header Bar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <button className="btn-action-tile secondary" onClick={() => navigate('/admin/pickups')}>
            <ArrowBackIcon fontSize="small" /> Back to Pickups
          </button>
          <h2 className="section-title" style={{ margin: 0, fontSize: '1.4rem' }}>
            Pickup Request #{p.id}
          </h2>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span className={`status-chip ${getStatusChipClass(p.status)}`} style={{ fontSize: '0.85rem', padding: '6px 14px' }}>
            {p.status}
          </span>
          {p.status === 'COLLECTED' && (
            <button className="btn-primary-action" onClick={() => setRecycleOpen(true)}>
              <RecyclingIcon fontSize="small" /> Confirm RECYCLED
            </button>
          )}
        </div>
      </div>

      {error && <Alert severity="error" sx={{ borderRadius: '12px' }}>{error}</Alert>}

      {/* Main Info Header Card */}
      <div className="active-pickup-card">
        <div className="active-card-header">
          <div className="header-badge-group">
            <span className="badge-active-tag">{p.status}</span>
            <span className="badge-id-tag">#{p.id}</span>
            <h3 className="active-category-title">{formatCategory(p.wasteCategory)}</h3>
          </div>
        </div>

        <div className="active-info-row">
          <div className="info-item">
            <span className="info-label"><PersonIcon style={{ fontSize: '16px' }} /> Customer</span>
            <span className="info-value">{formatName(p.customerName || p.customerEmail)}</span>
            <span className="text-muted-xs">{p.customerEmail} | {p.customerPhone || 'No Phone'}</span>
          </div>

          <div className="info-item">
            <span className="info-label"><DeleteSweepIcon style={{ fontSize: '16px' }} /> Pickup Location</span>
            <span className="info-value">{p.pickupAddress}</span>
            <span className="text-muted-xs">Pref: {p.preferredDate} {p.preferredTime ? `(${p.preferredTime})` : ''}</span>
          </div>

          <div className="info-item">
            <span className="info-label"><LocalShippingIcon style={{ fontSize: '16px' }} /> Assigned Collector</span>
            <span className="info-value">{formatName(p.collectorName) || 'Unassigned'}</span>
            <span className="text-muted-xs">{p.collectorEmail || 'No collector claimed yet'}</span>
          </div>
        </div>
      </div>

      {/* Detailed Sections Grid */}
      <div className="dashboard-grid-layout">
        <div className="grid-left-col">
          {/* Collection & Proof Card */}
          <div className="quick-actions-card">
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
              <CheckCircleIcon style={{ color: '#059669' }} />
              <h3 className="section-title" style={{ margin: 0 }}>Collection Information</h3>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div>
                <span className="text-muted-xs">ACTUAL WEIGHT</span>
                <p className="font-semibold" style={{ fontSize: '1.3rem', color: '#059669', margin: '4px 0 0 0' }}>
                  {p.actualWeight != null ? `${p.actualWeight} kg` : 'Pending collection'}
                </p>
              </div>

              <div>
                <span className="text-muted-xs">COLLECTED AT</span>
                <p className="font-semibold" style={{ margin: '4px 0 0 0' }}>
                  {p.collectedAt ? new Date(p.collectedAt).toLocaleString() : 'N/A'}
                </p>
              </div>

              <div style={{ gridColumn: 'span 2' }}>
                <span className="text-muted-xs">COLLECTION NOTES</span>
                <p style={{ margin: '4px 0 0 0', color: '#334155' }}>
                  {p.collectionNotes || 'No notes provided by collector.'}
                </p>
              </div>

              <div style={{ gridColumn: 'span 2' }}>
                <span className="text-muted-xs">COLLECTION PROOF PHOTO</span>
                {p.proofImageUrl ? (
                  <div style={{ marginTop: '8px' }}>
                    <img
                      src={p.proofImageUrl.startsWith('http') ? p.proofImageUrl : `${API_BASE_URL}${p.proofImageUrl}`}
                      alt="Collection Proof"
                      style={{ maxWidth: '100%', maxHeight: '200px', borderRadius: '8px', cursor: 'pointer', border: '1.5px solid #CBD5E1' }}
                      onClick={() => setProofImageModalOpen(true)}
                    />
                    <span className="text-muted-xs" style={{ display: 'block', marginTop: '4px' }}>Click image to enlarge full size</span>
                  </div>
                ) : (
                  <p style={{ color: '#94A3B8', margin: '4px 0 0 0' }}>No proof photo uploaded.</p>
                )}
              </div>
            </div>
          </div>

          {/* Recycling Confirmation Info */}
          <div className="quick-actions-card">
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
              <RecyclingIcon style={{ color: '#10B981' }} />
              <h3 className="section-title" style={{ margin: 0 }}>Recycling Confirmation</h3>
            </div>
            {p.status === 'RECYCLED' ? (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <span className="text-muted-xs">RECYCLED TIMESTAMP</span>
                  <p className="font-semibold" style={{ color: '#166534', margin: '4px 0 0 0' }}>
                    {p.recycledAt ? new Date(p.recycledAt).toLocaleString() : 'N/A'}
                  </p>
                </div>
                <div>
                  <span className="text-muted-xs">CONFIRMED BY ADMIN</span>
                  <p className="font-semibold" style={{ margin: '4px 0 0 0' }}>
                    {p.recycledByAdminName || p.recycledByAdminEmail || 'Admin'}
                  </p>
                </div>
                <div style={{ gridColumn: 'span 2' }}>
                  <span className="text-muted-xs">RECYCLING NOTES</span>
                  <p style={{ margin: '4px 0 0 0', color: '#334155' }}>
                    {p.recyclingNotes || 'Confirmed by Admin.'}
                  </p>
                </div>
              </div>
            ) : (
              <p style={{ color: '#64748B', margin: 0 }}>This pickup has not reached RECYCLED status yet.</p>
            )}
          </div>
        </div>

        {/* Lifecycle Timeline Column */}
        <div className="grid-right-col">
          <div className="quick-actions-card">
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
              <TimelineIcon style={{ color: '#395F51' }} />
              <h3 className="section-title" style={{ margin: 0 }}>Lifecycle Timeline</h3>
            </div>

            {!p.statusHistory || p.statusHistory.length === 0 ? (
              <p style={{ color: '#64748B', margin: 0 }}>No status history recorded.</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {p.statusHistory.map((h, idx) => (
                  <div
                    key={idx}
                    style={{
                      padding: '12px 14px',
                      borderRadius: '8px',
                      backgroundColor: '#F8FAFC',
                      borderLeft: '4px solid #395F51',
                      borderTop: '1px solid #E2E8F0',
                      borderRight: '1px solid #E2E8F0',
                      borderBottom: '1px solid #E2E8F0',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span className={`status-chip ${getStatusChipClass(h.status)}`}>{h.status}</span>
                      <span className="text-muted-xs">
                        {h.changedAt ? new Date(h.changedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                      </span>
                    </div>
                    <p style={{ margin: '8px 0 2px 0', fontSize: '0.875rem', fontWeight: 600, color: '#0F172A' }}>
                      {h.notes || 'Status updated'}
                    </p>
                    {h.changedByName && (
                      <span className="text-muted-xs" style={{ display: 'block' }}>
                        By: {formatName(h.changedByName)} ({h.changedByEmail})
                      </span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Recycle Modal */}
      <Dialog
        open={recycleOpen}
        onClose={() => setRecycleOpen(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{ style: { borderRadius: '12px' } }}
      >
        <DialogTitle sx={{ fontWeight: 800, color: '#0F172A' }}>
          Recycling Confirmation - Pickup #{p.id}
        </DialogTitle>
        <DialogContent dividers>
          <p style={{ margin: '0 0 12px 0', color: '#475569', fontSize: '0.9rem' }}>
            Category: <strong>{p.wasteCategory}</strong> | Actual Weight: <strong>{p.actualWeight} kg</strong>
          </p>
          <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label style={{ fontSize: '0.85rem', fontWeight: 700, color: '#0F172A' }}>Recycling Notes</label>
            <textarea
              rows={3}
              value={recyclingNotes}
              onChange={(e) => setRecyclingNotes(e.target.value)}
              placeholder="Add facility details or recycling confirmation notes..."
              style={{
                padding: '10px 14px',
                borderRadius: '8px',
                border: '1.5px solid #CBD5E1',
                fontSize: '0.9rem',
                fontFamily: 'Inter, sans-serif',
              }}
            />
          </div>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <button className="btn-action-tile secondary" onClick={() => setRecycleOpen(false)}>Cancel</button>
          <button className="btn-action-tile primary" onClick={handleConfirmRecycle} disabled={actionLoading}>
            {actionLoading ? <CircularProgress size={20} color="inherit" /> : 'Confirm RECYCLED'}
          </button>
        </DialogActions>
      </Dialog>

      {/* Enlarged Proof Image Modal */}
      <Dialog
        open={proofImageModalOpen}
        onClose={() => setProofImageModalOpen(false)}
        maxWidth="md"
        PaperProps={{ style: { borderRadius: '12px' } }}
      >
        <DialogTitle sx={{ fontWeight: 800, color: '#0F172A' }}>Collection Proof Photo - Pickup #{p.id}</DialogTitle>
        <DialogContent dividers style={{ textAlign: 'center' }}>
          {p.proofImageUrl && (
            <img
              src={p.proofImageUrl.startsWith('http') ? p.proofImageUrl : `${API_BASE_URL}${p.proofImageUrl}`}
              alt="Proof Full Size"
              style={{ maxWidth: '100%', maxHeight: '70vh', borderRadius: '8px' }}
            />
          )}
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <button className="btn-action-tile secondary" onClick={() => setProofImageModalOpen(false)}>Close</button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default AdminPickupDetailsPage;
