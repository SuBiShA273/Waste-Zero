import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { fetchMyPickups, fetchDashboardStats } from '../../store/pickupSlice';
import StatusTracker from '../../components/customer/StatusTracker';
import AddCircleOutlinedIcon from '@mui/icons-material/AddCircleOutlined';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import CheckCircleOutlinedIcon from '@mui/icons-material/CheckCircleOutlined';
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import CategoryIcon from '@mui/icons-material/Category';
import HistoryIcon from '@mui/icons-material/History';
import ReportProblemIcon from '@mui/icons-material/ReportProblem';
import ParkIcon from '@mui/icons-material/Park';
import AutorenewIcon from '@mui/icons-material/Autorenew';
import CircularProgress from '@mui/material/CircularProgress';

import { formatName, formatCategory } from '../../utils/formatters';

const CustomerDashboardOverview = () => {
  const { user } = useAuth();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { pickups, stats, activePickup, loading } = useSelector((state) => state.pickups);

  useEffect(() => {
    dispatch(fetchMyPickups());
    dispatch(fetchDashboardStats());
  }, [dispatch]);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
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

  return (
    <div className="dashboard-overview-wrapper">
      {/* Welcome Banner */}
      <section className="welcome-banner-card">
        <div className="welcome-text">
          <h2>
            {getGreeting()}, <span className="highlight-name">{formatName(user?.name)}</span>
          </h2>
          <p>Track your waste pickups and see the environmental impact you are making today.</p>
        </div>
        <button
          className="btn-primary-action"
          onClick={() => navigate('/customer/pickups/new')}
        >
          <AddCircleOutlinedIcon fontSize="small" />
          Request Pickup
        </button>
      </section>

      {/* Statistics Cards */}
      <section className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon-box total">
            <LocalShippingIcon />
          </div>
          <div className="stat-details">
            <span className="stat-label">Total Pickups</span>
            <span className="stat-value">{stats.totalPickups}</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-box completed">
            <CheckCircleOutlinedIcon />
          </div>
          <div className="stat-details">
            <span className="stat-label">Completed</span>
            <span className="stat-value">{stats.completedPickups}</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-box pending">
            <HourglassEmptyIcon />
          </div>
          <div className="stat-details">
            <span className="stat-label">Pending</span>
            <span className="stat-value">{stats.pendingPickups}</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-box cancelled">
            <CancelOutlinedIcon />
          </div>
          <div className="stat-details">
            <span className="stat-label">Cancelled</span>
            <span className="stat-value">{stats.cancelledPickups}</span>
          </div>
        </div>
      </section>

      {/* Main Grid: Left Column (Quick Actions & Recent Pickups) + Right Column (Widgets) */}
      <div className="dashboard-grid-layout">
        <div className="grid-left-col">
          {/* Quick Actions */}
          <div className="quick-actions-card">
            <h3 className="section-title">Quick Actions</h3>
            <div className="actions-button-group">
              <button
                className="btn-action-tile primary"
                onClick={() => navigate('/customer/pickups/new')}
              >
                <AddCircleOutlinedIcon /> Request Waste Pickup
              </button>
              <button
                className="btn-action-tile secondary"
                onClick={() => navigate('/customer/pickups')}
              >
                <HistoryIcon /> View Pickup History
              </button>
              <button
                className="btn-action-tile outline"
                onClick={() => navigate('/customer/complaints')}
              >
                <ReportProblemIcon /> Report an Issue
              </button>
            </div>
          </div>

          {/* Recent Pickups Table */}
          <div className="recent-pickups-card">
            <div className="card-top-bar">
              <h3 className="section-title">Recent Pickups</h3>
              <button
                className="link-view-all"
                onClick={() => navigate('/customer/pickups')}
              >
                View All
              </button>
            </div>

            {pickups.length === 0 ? (
              <div className="empty-table-state">
                <p>No recent waste pickup requests found.</p>
              </div>
            ) : (
              <div className="table-responsive-container">
                <table className="custom-data-table">
                  <thead>
                    <tr>
                      <th>Pickup ID</th>
                      <th>Category</th>
                      <th>Scheduled Date</th>
                      <th>Status</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pickups.slice(0, 5).map((pickup) => (
                      <tr key={pickup.id}>
                        <td className="font-semibold">#WZ-{pickup.id}</td>
                        <td>{formatCategory(pickup.wasteCategory)}</td>
                        <td>{pickup.preferredDate}</td>
                        <td>
                          <span className={`status-chip ${getStatusChipClass(pickup.status)}`}>
                            {pickup.status}
                          </span>
                        </td>
                        <td>
                          <button
                            className="btn-table-action"
                            onClick={() => navigate(`/customer/pickups/${pickup.id}`)}
                          >
                            Details
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

        {/* Right Column */}
        <div className="grid-right-col">
          {/* Environmental Impact Widget */}
          <div className="widget-card impact-widget">
            <h3 className="section-title">Environmental Impact</h3>
            <p className="widget-subtitle">Your contribution to a cleaner environment.</p>

            <div className="impact-metrics-list">
              <div className="impact-metric-item">
                <div className="metric-icon-box waste">
                  <AutorenewIcon fontSize="small" />
                </div>
                <div className="metric-details">
                  <span className="metric-value">
                    {(stats.completedPickups * 4.2).toFixed(1)} <span className="metric-unit">kg</span>
                  </span>
                  <span className="metric-label">Waste Recycled</span>
                </div>
              </div>

              <div className="impact-metric-item">
                <div className="metric-icon-box co2">
                  <ParkIcon fontSize="small" />
                </div>
                <div className="metric-details">
                  <span className="metric-value">
                    {(stats.completedPickups * 2.1).toFixed(1)} <span className="metric-unit">kg</span>
                  </span>
                  <span className="metric-label">Est. CO₂ Saved</span>
                </div>
              </div>

              <div className="impact-metric-item">
                <div className="metric-icon-box requests" style={{ backgroundColor: '#EFF6FF', color: '#1D4ED8' }}>
                  <CheckCircleOutlinedIcon fontSize="small" />
                </div>
                <div className="metric-details">
                  <span className="metric-value">{stats.totalPickups} Requests</span>
                  <span className="metric-label">Total Pickup Requests</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Full Width Customer Support Card Below Grid */}
      <section className="customer-support-banner-card">
        <div className="support-banner-content">
          <div className="support-banner-text">
            <h3>Customer Support</h3>
            <p>
              Need assistance with your waste pickup schedule or have specific queries? You can reach out to our team at any time.
            </p>
          </div>
          <button
            className="btn-primary-action"
            onClick={() => navigate('/customer/complaints')}
          >
            Contact Support
          </button>
        </div>
      </section>
    </div>
  );
};

export default CustomerDashboardOverview;
