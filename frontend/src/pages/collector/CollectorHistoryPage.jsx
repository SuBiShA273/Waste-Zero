import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchPickupHistory } from '../../store/collectorSlice';
import HistoryIcon from '@mui/icons-material/History';
import ScaleIcon from '@mui/icons-material/Scale';
import CircularProgress from '@mui/material/CircularProgress';

import { formatName, formatCategory, formatStatus, formatDateTime } from '../../utils/formatters';

const CollectorHistoryPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { history, loading } = useSelector((state) => state.collector);

  const [filter, setFilter] = useState('ALL');

  useEffect(() => {
    dispatch(fetchPickupHistory());
  }, [dispatch]);

  const getStatusChipClass = (status) => {
    switch (status) {
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

  const filteredHistory = history.filter((item) => {
    if (filter === 'ALL') return true;
    if (filter === 'COMPLETED') return ['COLLECTED', 'RECYCLED'].includes(item.status);
    if (filter === 'REJECTED') return ['REJECTED', 'CANCELLED'].includes(item.status);
    return true;
  });

  return (
    <div className="pickups-list-page-wrapper">
      {/* Top Header Bar */}
      <div className="pickups-header-bar">
        <div>
          <h2>Collector Pickup History</h2>
          <p className="subtitle">
            Archived record of completed, recycled, or rejected collection assignments.
          </p>
        </div>
      </div>

      {/* Filter Tabs Bar */}
      <div className="filter-tabs-bar">
        <button
          className={`tab-btn ${filter === 'ALL' ? 'active' : ''}`}
          onClick={() => setFilter('ALL')}
        >
          All History ({history.length})
        </button>
        <button
          className={`tab-btn ${filter === 'COMPLETED' ? 'active' : ''}`}
          onClick={() => setFilter('COMPLETED')}
        >
          Completed
        </button>
        <button
          className={`tab-btn ${filter === 'REJECTED' ? 'active' : ''}`}
          onClick={() => setFilter('REJECTED')}
        >
          Rejected / Cancelled
        </button>
      </div>

      {/* Table Card */}
      <div className="table-card">
        {loading ? (
          <div className="card-loading-state">
            <CircularProgress sx={{ color: '#395F51' }} size={36} />
            <span>Loading history records...</span>
          </div>
        ) : filteredHistory.length === 0 ? (
          <div className="empty-history-state" style={{ padding: '48px', textAlign: 'center' }}>
            <HistoryIcon style={{ fontSize: '48px', color: '#94A3B8', marginBottom: '12px' }} />
            <h3>No History Records</h3>
            <p>No historical pickups match the selected filter criteria.</p>
          </div>
        ) : (
          <div className="table-responsive-container">
            <table className="custom-data-table">
              <thead>
                <tr>
                  <th>Pickup ID</th>
                  <th>Category</th>
                  <th>Customer</th>
                  <th>Pickup Address</th>
                  <th>Completion Timestamp</th>
                  <th>Actual Weight</th>
                  <th>Status</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredHistory.map((item) => (
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
                      <div className="text-truncate-cell" style={{ maxWidth: '200px' }}>
                        {item.pickupAddress}
                      </div>
                    </td>
                    <td>
                      {item.collectedAt
                        ? formatDateTime(item.collectedAt)
                        : item.preferredDate}
                    </td>
                    <td>
                      {item.actualWeight ? (
                        <span
                          style={{
                            fontWeight: 700,
                            color: '#059669',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px',
                          }}
                        >
                          <ScaleIcon style={{ fontSize: 16 }} /> {item.actualWeight} kg
                        </span>
                      ) : (
                        <span className="text-muted-xs">N/A</span>
                      )}
                    </td>
                    <td>
                      <span className={`status-chip ${getStatusChipClass(item.status)}`}>
                        {formatStatus(item.status)}
                      </span>
                    </td>
                    <td style={{ textAlign: 'right' }} onClick={(e) => e.stopPropagation()}>
                      <button
                        className="btn-table-action"
                        onClick={() => navigate(`/collector/pickups/${item.id}`)}
                      >
                        View Details
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

export default CollectorHistoryPage;
