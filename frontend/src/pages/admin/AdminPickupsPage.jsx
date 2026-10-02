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
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';

import { formatName, formatCategory } from '../../utils/formatters';

const AdminPickupsPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { pickups, pickupsLoading, error, actionLoading } = useSelector((state) => state.admin);

  const [statusFilter, setStatusFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  // Recycle Modal
  const [recycleTargetPickup, setRecycleTargetPickup] = useState(null);
  const [recyclingNotes, setRecyclingNotes] = useState('');

  const loadData = () => {
    const params = {};
    if (statusFilter) params.status = statusFilter;
    if (categoryFilter) params.category = categoryFilter;
    dispatch(fetchAdminPickups(params));
  };

  useEffect(() => {
    loadData();
  }, [dispatch, statusFilter, categoryFilter]);

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
          Inspect, filter, and manage all customer pickup requests across all lifecycle stages.
        </p>
      </div>

      {error && <Alert severity="error" sx={{ borderRadius: '12px' }}>{error}</Alert>}

      {/* Professional Filter and Search Card */}
      <div className="quick-actions-card" style={{ border: '1.5px solid #CBD5E1', padding: '18px 24px' }}>
        <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap', alignItems: 'center' }}>
          {/* Search Box */}
          <div style={{ flex: '1 1 320px', position: 'relative' }}>
            <SearchIcon
              style={{
                position: 'absolute',
                left: '14px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: '#64748B',
                fontSize: '20px',
                pointerEvents: 'none',
              }}
            />
            <input
              type="text"
              placeholder="Search by Pickup ID, customer, address, or collector..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                height: '44px',
                padding: '0 16px 0 44px',
                borderRadius: '8px',
                border: '1.5px solid #CBD5E1',
                fontSize: '0.925rem',
                color: '#0F172A',
                backgroundColor: '#FFFFFF',
                outline: 'none',
                transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
              }}
              onFocus={(e) => {
                e.target.style.borderColor = '#395F51';
                e.target.style.boxShadow = '0 0 0 3px rgba(57, 95, 81, 0.15)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = '#CBD5E1';
                e.target.style.boxShadow = 'none';
              }}
            />
          </div>

          {/* Status Filter */}
          <div style={{ minWidth: '180px' }}>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              style={{
                width: '100%',
                height: '44px',
                padding: '0 14px',
                borderRadius: '8px',
                border: '1.5px solid #CBD5E1',
                fontSize: '0.9rem',
                backgroundColor: '#FFFFFF',
                color: '#0F172A',
                fontWeight: 600,
                cursor: 'pointer',
                outline: 'none',
              }}
            >
              <option value="">All Lifecycle Statuses</option>
              <option value="REQUESTED">REQUESTED</option>
              <option value="ASSIGNED">ASSIGNED</option>
              <option value="ACCEPTED">ACCEPTED</option>
              <option value="ON_THE_WAY">ON THE WAY</option>
              <option value="ARRIVED">ARRIVED</option>
              <option value="COLLECTED">COLLECTED</option>
              <option value="RECYCLED">RECYCLED</option>
              <option value="CANCELLED">CANCELLED</option>
              <option value="REASSIGNABLE">REASSIGNABLE</option>
            </select>
          </div>

          {/* Category Filter */}
          <div style={{ minWidth: '180px' }}>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              style={{
                width: '100%',
                height: '44px',
                padding: '0 14px',
                borderRadius: '8px',
                border: '1.5px solid #CBD5E1',
                fontSize: '0.9rem',
                backgroundColor: '#FFFFFF',
                color: '#0F172A',
                fontWeight: 600,
                cursor: 'pointer',
                outline: 'none',
              }}
            >
              <option value="">All Waste Categories</option>
              <option value="PLASTIC">PLASTIC</option>
              <option value="PAPER">PAPER</option>
              <option value="GLASS">GLASS</option>
              <option value="METAL">METAL</option>
              <option value="ORGANIC">ORGANIC</option>
              <option value="E_WASTE">E_WASTE</option>
              <option value="MIXED">MIXED</option>
              <option value="OTHER">OTHER</option>
            </select>
          </div>

          {/* Clear Filters Button */}
          {(searchQuery || statusFilter || categoryFilter) && (
            <button
              className="btn-action-tile secondary"
              onClick={() => {
                setSearchQuery('');
                setStatusFilter('');
                setCategoryFilter('');
              }}
              style={{ height: '44px', padding: '0 16px', fontSize: '0.85rem' }}
            >
              Reset Filters
            </button>
          )}
        </div>
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
                  <th>Actual Weight</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredPickups.map((p) => (
                  <tr key={p.id} className="clickable-row" onClick={() => navigate(`/admin/pickups/${p.id}`)}>
                    <td className="font-semibold">#{p.id}</td>
                    <td className="font-semibold">{formatName(p.customerName || p.customerEmail)}</td>
                    <td>{formatCategory(p.wasteCategory)}</td>
                    <td className="text-truncate" style={{ maxWidth: '200px' }}>{p.pickupAddress}</td>
                    <td className="text-muted-xs">
                      {p.preferredDate} {p.preferredTime ? `(${p.preferredTime})` : ''}
                    </td>
                    <td>
                      <span className={`status-chip ${getStatusChipClass(p.status)}`}>
                        {p.status}
                      </span>
                    </td>
                    <td>{formatName(p.collectorName) || 'Unassigned'}</td>
                    <td className="font-semibold" style={{ color: p.actualWeight ? '#395F51' : '#94A3B8' }}>
                      {p.actualWeight != null ? `${p.actualWeight} kg` : 'N/A'}
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
                            onClick={() => {
                              setRecycleTargetPickup(p);
                              setRecyclingNotes('');
                            }}
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

      {/* Recycle Confirmation Dialog */}
      <Dialog
        open={Boolean(recycleTargetPickup)}
        onClose={() => setRecycleTargetPickup(null)}
        maxWidth="sm"
        fullWidth
        PaperProps={{ style: { borderRadius: '12px' } }}
      >
        <DialogTitle sx={{ fontWeight: 800, color: '#0F172A' }}>
          Recycling Confirmation - Pickup #{recycleTargetPickup?.id}
        </DialogTitle>
        <DialogContent dividers>
          <p style={{ margin: '0 0 12px 0', fontSize: '0.9rem', color: '#475569' }}>
            Customer: <strong>{formatName(recycleTargetPickup?.customerName)}</strong> | Category: <strong>{recycleTargetPickup?.wasteCategory}</strong> | Weight: <strong>{recycleTargetPickup?.actualWeight} kg</strong>
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
          <button className="btn-action-tile secondary" onClick={() => setRecycleTargetPickup(null)} disabled={actionLoading}>
            Cancel
          </button>
          <button className="btn-action-tile primary" onClick={handleConfirmRecycle} disabled={actionLoading}>
            {actionLoading ? <CircularProgress size={20} color="inherit" /> : 'Confirm RECYCLED'}
          </button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default AdminPickupsPage;
