import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAdminComplaints } from '../../store/adminSlice';
import { useNavigate } from 'react-router-dom';

// MUI Icons & Components
import ReportProblemIcon from '@mui/icons-material/ReportProblem';
import EditIcon from '@mui/icons-material/Edit';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';

import { formatName } from '../../utils/formatters';

const AdminComplaintsPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { complaints, complaintsLoading, error } = useSelector((state) => state.admin);

  const [statusFilter, setStatusFilter] = useState('');

  useEffect(() => {
    const params = {};
    if (statusFilter) params.status = statusFilter;
    dispatch(fetchAdminComplaints(params));
  }, [dispatch, statusFilter]);

  const getStatusChipClass = (status) => {
    switch (status) {
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
      {/* Page Header */}
      <div>
        <h2 className="section-title" style={{ fontSize: '1.4rem', margin: 0, color: '#000000' }}>Customer Complaint Management</h2>
        <p style={{ color: '#64748B', fontSize: '0.9rem', margin: '4px 0 0 0' }}>
          Review customer complaints, update investigation status, and provide administrative resolution responses.
        </p>
      </div>

      {error && <Alert severity="error" sx={{ borderRadius: '12px' }}>{error}</Alert>}

      {/* Filter Bar */}
      <div className="quick-actions-card" style={{ border: '1.5px solid #CBD5E1' }}>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <label style={{ fontSize: '0.9rem', fontWeight: 700, color: '#000000' }}>Filter Status:</label>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
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
            <option value="OPEN">OPEN</option>
            <option value="UNDER_REVIEW">UNDER REVIEW</option>
            <option value="RESOLVED">RESOLVED</option>
          </select>
        </div>
      </div>

      {/* Complaints Data Table */}
      <div className="recent-pickups-card" style={{ border: '1.5px solid #CBD5E1' }}>
        {complaintsLoading ? (
          <div className="loading-screen" style={{ minHeight: '30vh', backgroundColor: 'transparent' }}>
            <CircularProgress sx={{ color: '#395F51' }} />
          </div>
        ) : complaints.length === 0 ? (
          <div className="empty-table-state">
            <p>No complaints found matching the criteria.</p>
          </div>
        ) : (
          <div className="table-responsive-container">
            <table className="custom-data-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Customer</th>
                  <th>Pickup ID</th>
                  <th>Subject</th>
                  <th>Status</th>
                  <th>Filed Date</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {complaints.map((c) => (
                  <tr key={c.id} className="clickable-row" onClick={() => navigate(`/admin/complaints/${c.id}`)}>
                    <td className="font-semibold">#{c.id}</td>
                    <td className="font-semibold">{formatName(c.customerName || c.customerEmail)}</td>
                    <td>{c.pickupId ? `#${c.pickupId}` : 'N/A'}</td>
                    <td className="font-semibold text-truncate" style={{ maxWidth: '220px' }}>
                      {c.subject}
                    </td>
                    <td>
                      <span className={`status-chip ${getStatusChipClass(c.status)}`}>
                        {c.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="text-muted-xs">
                      {c.createdAt ? new Date(c.createdAt).toLocaleDateString() : 'N/A'}
                    </td>
                    <td style={{ textAlign: 'right' }} onClick={(e) => e.stopPropagation()}>
                      <button
                        className="btn-action-tile primary"
                        onClick={() => navigate(`/admin/complaints/${c.id}`)}
                        style={{ padding: '6px 14px', fontSize: '0.85rem' }}
                      >
                        <EditIcon fontSize="small" /> Review
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminComplaintsPage;
