import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAdminPickups, recyclePickup } from '../../store/adminSlice';
import { useNavigate } from 'react-router-dom';

// MUI Icons & Components
import SearchIcon from '@mui/icons-material/Search';
import VisibilityIcon from '@mui/icons-material/Visibility';
import RecyclingIcon from '@mui/icons-material/Recycling';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';

import { formatName, formatCategory } from '../../utils/formatters';

const AdminPickupsPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { pickups, pickupsLoading, error, actionLoading } = useSelector((state) => state.admin);

  const [statusFilter, setStatusFilter] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  // Recycle Modal
  const [recycleTargetPickup, setRecycleTargetPickup] = useState(null);
  const [recyclingNotes, setRecyclingNotes] = useState('');

  const loadData = () => {
    const params = {};
    if (statusFilter) params.status = statusFilter;
    dispatch(fetchAdminPickups(params));
  };

  useEffect(() => {
    loadData();
  }, [dispatch, statusFilter]);

  const handleConfirmRecycle = async () => {
    if (!recycleTargetPickup) return;
    try {
      await dispatch(recyclePickup({ id: recycleTargetPickup.id, notes: recyclingNotes })).unwrap();
      setRecycleTargetPickup(null);
      setRecyclingNotes('');
      loadData();
    } catch (err) {
      alert(err || 'Failed to confirm recycling');
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
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase().trim();
    return (
      p.id.toString().includes(q) ||
      (p.customerName && p.customerName.toLowerCase().includes(q)) ||
      (p.pickupAddress && p.pickupAddress.toLowerCase().includes(q)) ||
      (p.collectorName && p.collectorName.toLowerCase().includes(q)) ||
      (p.wasteCategory && p.wasteCategory.toLowerCase().includes(q))
    );
  });

  return (
    <div className="dashboard-overview-wrapper">
      {/* Header Info */}
      <div>
        <h2 className="section-title" style={{ fontSize: '1.4rem', margin: 0, color: '#000000' }}>
          Pickup Request Directory
        </h2>
        <p style={{ color: '#64748B', fontSize: '0.9rem', margin: '4px 0 0 0' }}>
          Inspect, filter, and manage all customer pickup requests across all stages.
        </p>
      </div>

      {error && <Alert severity="error" sx={{ borderRadius: '12px' }}>{error}</Alert>}

      {/* Filter and Search Bar — flat, no card wrapper */}
      <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', alignItems: 'center' }}>
        {/* Search Box */}
        <div style={{ flex: '1 1 280px', position: 'relative' }}>
          <SearchIcon style={{
            position: 'absolute', left: '12px', top: '50%',
            transform: 'translateY(-50%)', color: '#94A3B8', fontSize: '20px', pointerEvents: 'none',
          }} />
          <input
            type="text"
            placeholder="Search by ID, customer, address or collector..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: '100%', height: '42px',
              padding: '0 14px 0 40px',
              borderRadius: '8px',
              border: '1.5px solid #CBD5E1',
              fontSize: '0.9rem', color: '#0F172A',
              backgroundColor: '#FFFFFF',
              outline: 'none', boxSizing: 'border-box',
              transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
            }}
            onFocus={(e) => { e.target.style.borderColor = '#395F51'; e.target.style.boxShadow = '0 0 0 3px rgba(57,95,81,0.12)'; }}
            onBlur={(e) => { e.target.style.borderColor = '#CBD5E1'; e.target.style.boxShadow = 'none'; }}
          />
        </div>

        {/* Status Filter */}
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          style={{
            height: '42px', padding: '0 14px',
            borderRadius: '8px',
            border: '1.5px solid #CBD5E1',
            fontSize: '0.9rem',
            backgroundColor: '#FFFFFF',
            color: '#0F172A',
            fontWeight: 600, cursor: 'pointer', outline: 'none',
          }}
        >
          <option value="">All Statuses</option>
          <option value="REQUESTED">REQUESTED</option>
          <option value="ASSIGNED">ASSIGNED</option>
          <option value="ACCEPTED">ACCEPTED</option>
          <option value="ON_THE_WAY">ON THE WAY</option>
          <option value="ARRIVED">ARRIVED</option>
          <option value="COLLECTED">COLLECTED</option>
          <option value="RECYCLED">RECYCLED</option>
        </select>

        {/* Clear Filters */}
        {(searchQuery || statusFilter) && (
          <button
            className="btn-action-tile secondary"
            onClick={() => { setSearchQuery(''); setStatusFilter(''); }}
            style={{ height: '42px', padding: '0 16px', fontSize: '0.85rem' }}
          >
            Reset Filters
          </button>
        )}
      </div>

      {/* Pickups Table */}
      <div className="recent-pickups-card" style={{ border: '1.5px solid #CBD5E1' }}>
        {pickupsLoading ? (
          <div className="loading-screen" style={{ minHeight: '30vh', backgroundColor: 'transparent' }}>
            <CircularProgress sx={{ color: '#395F51' }} />
          </div>
        ) : filteredPickups.length === 0 ? (
          <div className="empty-table-state">
            <p>No pickups found matching the selected search criteria.</p>
          </div>
        ) : (
          <div className="table-responsive-container">
            <table className="custom-data-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Customer</th>
                  <th>Category</th>
                  <th>Address</th>
                  <th>Preferred Date</th>
                  <th>Status</th>
                  <th>Collector</th>
                  <th>Weight</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredPickups.map((p) => (
                  <tr key={p.id} className="clickable-row" onClick={() => navigate(`/admin/pickups/${p.id}`)}>
                    <td className="font-semibold">#{p.id}</td>
                    <td className="font-semibold">{formatName(p.customerName || p.customerEmail)}</td>
                    <td>{formatCategory(p.wasteCategory)}</td>
                    <td className="text-truncate" style={{ maxWidth: '180px' }}>{p.pickupAddress}</td>
                    <td className="text-muted-xs">
                      {p.preferredDate
                        ? new Date(p.preferredDate).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })
                        : 'N/A'}
                    </td>
                    <td>
                      <span className={`status-chip ${getStatusChipClass(p.status)}`}>
                        {p.status}
                      </span>
                    </td>
                    <td>{formatName(p.collectorName) || <span style={{ color: '#94A3B8' }}>Unassigned</span>}</td>
                    <td className="font-semibold" style={{ color: p.actualWeight ? '#395F51' : '#94A3B8' }}>
                      {p.actualWeight != null ? `${p.actualWeight} kg` : '—'}
                    </td>
                    <td style={{ textAlign: 'right' }} onClick={(e) => e.stopPropagation()}>
                      <div className="action-buttons-cell" style={{ justifyContent: 'flex-end', gap: '8px' }}>
                        <button
                          className="btn-table-action"
                          onClick={() => navigate(`/admin/pickups/${p.id}`)}
                          style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                        >
                          <VisibilityIcon fontSize="small" /> Details
                        </button>
                        {p.status === 'COLLECTED' && (
                          <button
                            className="btn-action-tile primary"
                            onClick={() => { setRecycleTargetPickup(p); setRecyclingNotes(''); }}
                            style={{ padding: '4px 12px', fontSize: '0.8rem' }}
                          >
                            <RecyclingIcon fontSize="small" /> Recycle
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

      {/* Recycle Confirmation Modal */}
      {recycleTargetPickup && (
        <div
          onClick={() => setRecycleTargetPickup(null)}
          style={{
            position: 'fixed', inset: 0,
            backgroundColor: 'rgba(15, 23, 42, 0.45)',
            backdropFilter: 'blur(2px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            zIndex: 1000, padding: '16px',
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              width: '100%', maxWidth: '480px',
              backgroundColor: '#FFFFFF',
              border: '1.5px solid #CBD5E1',
              borderRadius: '16px',
              overflow: 'hidden',
              boxShadow: '0 20px 60px -10px rgba(0,0,0,0.2)',
            }}
          >
            {/* Header */}
            <div style={{
              padding: '18px 24px',
              backgroundColor: '#F8FAFC',
              borderBottom: '1.5px solid #E2E8F0',
              display: 'flex', alignItems: 'center', gap: '12px',
            }}>
              <div style={{
                width: '36px', height: '36px', borderRadius: '50%',
                backgroundColor: '#DCFCE7',
                display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
              }}>
                <RecyclingIcon style={{ color: '#059669', fontSize: '20px' }} />
              </div>
              <div>
                <p style={{ margin: 0, fontWeight: 800, fontSize: '1rem', color: '#0F172A' }}>
                  Confirm Recycling — Pickup #{recycleTargetPickup.id}
                </p>
                <p style={{ margin: 0, fontSize: '0.78rem', color: '#64748B', marginTop: '2px' }}>
                  This will mark the pickup as RECYCLED
                </p>
              </div>
            </div>

            {/* Body */}
            <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {/* Summary pill */}
              <div style={{
                display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px',
              }}>
                {[
                  { label: 'Customer', value: formatName(recycleTargetPickup.customerName) },
                  { label: 'Category', value: formatCategory(recycleTargetPickup.wasteCategory) },
                  { label: 'Weight', value: `${recycleTargetPickup.actualWeight ?? '—'} kg` },
                ].map(({ label, value }) => (
                  <div key={label} style={{
                    backgroundColor: '#F8FAFC', border: '1.5px solid #E2E8F0',
                    borderRadius: '8px', padding: '10px 12px',
                  }}>
                    <p style={{ margin: 0, fontSize: '0.72rem', fontWeight: 700, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.4px' }}>{label}</p>
                    <p style={{ margin: '4px 0 0 0', fontSize: '0.88rem', fontWeight: 700, color: '#0F172A' }}>{value}</p>
                  </div>
                ))}
              </div>

              {/* Notes textarea */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '0.82rem', fontWeight: 700, color: '#0F172A' }}>Recycling Notes <span style={{ color: '#94A3B8', fontWeight: 500 }}>(optional)</span></label>
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
                    fontFamily: 'inherit',
                    resize: 'vertical',
                    outline: 'none',
                    transition: 'border-color 0.2s ease',
                  }}
                  onFocus={(e) => { e.target.style.borderColor = '#395F51'; }}
                  onBlur={(e) => { e.target.style.borderColor = '#CBD5E1'; }}
                />
              </div>
            </div>

            {/* Footer */}
            <div style={{
              padding: '16px 24px',
              backgroundColor: '#F8FAFC',
              borderTop: '1.5px solid #E2E8F0',
              display: 'flex', justifyContent: 'flex-end', gap: '10px',
            }}>
              <button
                className="btn-action-tile secondary"
                onClick={() => setRecycleTargetPickup(null)}
                disabled={actionLoading}
              >
                Cancel
              </button>
              <button
                className="btn-action-tile primary"
                onClick={handleConfirmRecycle}
                disabled={actionLoading}
                style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
              >
                {actionLoading ? <CircularProgress size={18} color="inherit" /> : <><RecyclingIcon fontSize="small" /> Confirm Recycled</>}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPickupsPage;
