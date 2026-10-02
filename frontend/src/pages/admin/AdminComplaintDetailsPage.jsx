import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAdminComplaintDetails, updateAdminComplaint, clearCurrentComplaint } from '../../store/adminSlice';

// MUI Icons & Components
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ReportProblemIcon from '@mui/icons-material/ReportProblem';
import DeleteSweepIcon from '@mui/icons-material/DeleteSweep';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';

import { formatName, formatCategory } from '../../utils/formatters';

const AdminComplaintDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { currentComplaint, currentComplaintLoading, error, actionLoading } = useSelector((state) => state.admin);

  const [status, setStatus] = useState('UNDER_REVIEW');
  const [adminResponse, setAdminResponse] = useState('');
  const [updateSuccess, setUpdateSuccess] = useState(false);

  useEffect(() => {
    if (id) {
      dispatch(fetchAdminComplaintDetails(id));
    }
    return () => {
      dispatch(clearCurrentComplaint());
    };
  }, [dispatch, id]);

  useEffect(() => {
    if (currentComplaint) {
      setStatus(currentComplaint.status || 'UNDER_REVIEW');
      setAdminResponse(currentComplaint.adminResponse || '');
    }
  }, [currentComplaint]);

  const handleSubmitUpdate = async (e) => {
    e.preventDefault();
    setUpdateSuccess(false);
    try {
      await dispatch(updateAdminComplaint({ id, status, adminResponse })).unwrap();
      setUpdateSuccess(true);
      dispatch(fetchAdminComplaintDetails(id));
    } catch (err) {
      alert(err || 'Failed to update complaint');
    }
  };

  if (currentComplaintLoading || !currentComplaint) {
    return (
      <div className="loading-screen" style={{ minHeight: '50vh', backgroundColor: 'transparent' }}>
        <CircularProgress sx={{ color: '#395F51' }} size={48} />
      </div>
    );
  }

  const c = currentComplaint;

  const getStatusChipClass = (st) => {
    switch (st) {
      case 'RESOLVED':
        return 'chip-recycled';
      case 'UNDER_REVIEW':
        return 'chip-active';
      case 'OPEN':
      default:
        return 'chip-cancelled';
    }
  };

  return (
    <div className="dashboard-overview-wrapper">
      {/* Top Header Bar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <button className="btn-action-tile secondary" onClick={() => navigate('/admin/complaints')}>
            <ArrowBackIcon fontSize="small" /> Back to Complaints
          </button>
          <h2 className="section-title" style={{ margin: 0, fontSize: '1.4rem', color: '#000000' }}>
            Complaint #{c.id}
          </h2>
        </div>

        <span className={`status-chip ${getStatusChipClass(c.status)}`} style={{ fontSize: '0.85rem', padding: '6px 14px' }}>
          {c.status.replace('_', ' ')}
        </span>
      </div>

      {error && <Alert severity="error" sx={{ borderRadius: '12px' }}>{error}</Alert>}
      {updateSuccess && <Alert severity="success" sx={{ borderRadius: '12px' }}>Complaint updated successfully!</Alert>}

      <div className="dashboard-grid-layout">
        {/* Left Column: Complaint & Related Pickup Details */}
        <div className="grid-left-col">
          <div className="quick-actions-card" style={{ border: '1.5px solid #CBD5E1', display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', paddingBottom: '12px', borderBottom: '1px solid #E2E8F0' }}>
              <ReportProblemIcon style={{ color: '#DC2626', fontSize: '24px' }} />
              <h3 className="section-title" style={{ margin: 0, color: '#000000', fontSize: '1.25rem' }}>Complaint Details</h3>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <span className="text-muted-xs" style={{ textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: 700, color: '#64748B' }}>SUBJECT</span>
              <p style={{ fontSize: '1.15rem', fontWeight: 700, color: '#000000', margin: 0 }}>
                {c.subject}
              </p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <span className="text-muted-xs" style={{ textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: 700, color: '#64748B' }}>DESCRIPTION</span>
              <div
                style={{
                  backgroundColor: '#F8FAFC',
                  padding: '16px',
                  borderRadius: '8px',
                  border: '1.5px solid #CBD5E1',
                  fontSize: '0.95rem',
                  color: '#000000',
                  whiteSpace: 'pre-wrap',
                  lineHeight: 1.5,
                }}
              >
                {c.description}
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', paddingTop: '12px', borderTop: '1px solid #E2E8F0' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <span className="text-muted-xs" style={{ textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: 700, color: '#64748B' }}>FILED BY</span>
                <p style={{ margin: 0, fontWeight: 700, color: '#000000', fontSize: '0.95rem' }}>
                  {formatName(c.customerName || c.customerEmail)}
                </p>
                <span style={{ fontSize: '0.85rem', color: '#64748B' }}>{c.customerEmail}</span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <span className="text-muted-xs" style={{ textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: 700, color: '#64748B' }}>FILED DATE</span>
                <p style={{ margin: 0, fontSize: '0.95rem', color: '#000000', fontWeight: 600 }}>
                  {c.createdAt ? new Date(c.createdAt).toLocaleString() : 'N/A'}
                </p>
              </div>
            </div>
          </div>

          {/* Attached Pickup Info */}
          {c.pickupId && (
            <div className="quick-actions-card" style={{ border: '1.5px solid #CBD5E1' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <DeleteSweepIcon style={{ color: '#395F51' }} />
                  <h3 className="section-title" style={{ margin: 0, color: '#000000' }}>Attached Pickup #{c.pickupId}</h3>
                </div>
                <button
                  className="btn-table-action"
                  onClick={() => navigate(`/admin/pickups/${c.pickupId}`)}
                >
                  View Pickup Details
                </button>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <span className="text-muted-xs">WASTE CATEGORY</span>
                  <p className="font-semibold" style={{ margin: '4px 0 0 0' }}>{formatCategory(c.pickupWasteCategory) || 'N/A'}</p>
                </div>
                <div>
                  <span className="text-muted-xs">PICKUP STATUS</span>
                  <p className="font-semibold" style={{ margin: '4px 0 0 0' }}>{c.pickupStatus || 'N/A'}</p>
                </div>
                <div style={{ gridColumn: 'span 2' }}>
                  <span className="text-muted-xs">ADDRESS</span>
                  <p style={{ margin: '4px 0 0 0', fontSize: '0.9rem' }}>{c.pickupAddress || 'N/A'}</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Admin Response & Status Controls */}
        <div className="grid-right-col">
          <div className="quick-actions-card" style={{ border: '1.5px solid #395F51' }}>
            <h3 className="section-title" style={{ color: '#395F51' }}>Admin Review & Resolution</h3>
            <form onSubmit={handleSubmitUpdate} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '0.85rem', fontWeight: 700, color: '#0F172A' }}>Complaint Status</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  style={{
                    padding: '10px 14px',
                    borderRadius: '8px',
                    border: '1.5px solid #CBD5E1',
                    fontSize: '0.9rem',
                    backgroundColor: '#FFFFFF',
                    fontWeight: 700,
                  }}
                >
                  <option value="OPEN">OPEN (Under initial filing)</option>
                  <option value="UNDER_REVIEW">UNDER REVIEW (Investigation in progress)</option>
                  <option value="RESOLVED">RESOLVED (Resolution response sent)</option>
                </select>
              </div>

              <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '0.85rem', fontWeight: 700, color: '#0F172A' }}>Admin Response & Resolution Notes</label>
                <textarea
                  rows={6}
                  value={adminResponse}
                  onChange={(e) => setAdminResponse(e.target.value)}
                  placeholder="Type official findings or response to the customer..."
                  style={{
                    padding: '10px 14px',
                    borderRadius: '8px',
                    border: '1.5px solid #CBD5E1',
                    fontSize: '0.9rem',
                    fontFamily: 'Inter, sans-serif',
                  }}
                />
              </div>

              <button
                type="submit"
                className="btn-primary-action"
                style={{ width: '100%', justifyContent: 'center', padding: '14px' }}
                disabled={actionLoading}
              >
                {actionLoading ? <CircularProgress size={20} color="inherit" /> : 'Save Complaint Update'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminComplaintDetailsPage;
