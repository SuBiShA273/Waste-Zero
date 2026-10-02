import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAdminStats } from '../../store/adminSlice';
import { useNavigate } from 'react-router-dom';

// MUI Icons
import PeopleIcon from '@mui/icons-material/People';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import DeleteSweepIcon from '@mui/icons-material/DeleteSweep';
import RecyclingIcon from '@mui/icons-material/Recycling';
import ReportProblemIcon from '@mui/icons-material/ReportProblem';
import Co2Icon from '@mui/icons-material/Co2';
import ParkIcon from '@mui/icons-material/Park';
import WaterDropIcon from '@mui/icons-material/WaterDrop';
import BoltIcon from '@mui/icons-material/Bolt';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';
import CheckCircleOutlinedIcon from '@mui/icons-material/CheckCircleOutlined';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import AutorenewIcon from '@mui/icons-material/Autorenew';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';

const AdminDashboardPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { stats, statsLoading, error } = useSelector((state) => state.admin);

  useEffect(() => {
    dispatch(fetchAdminStats());
  }, [dispatch]);

  if (statsLoading && !stats) {
    return (
      <div className="loading-screen" style={{ minHeight: '50vh', backgroundColor: 'transparent' }}>
        <CircularProgress sx={{ color: '#395F51' }} size={48} />
      </div>
    );
  }

  const CATEGORY_DEFAULTS = [
    { category: 'PLASTIC', conversionFactor: 1.5 },
    { category: 'PAPER', conversionFactor: 0.9 },
    { category: 'GLASS', conversionFactor: 0.3 },
    { category: 'METAL', conversionFactor: 2.5 },
    { category: 'ORGANIC', conversionFactor: 0.5 },
    { category: 'E_WASTE', conversionFactor: 3.0 },
    { category: 'MIXED', conversionFactor: 0.7 },
    { category: 'OTHER', conversionFactor: 0.5 },
  ];

  const categoryDataMap = (stats?.categoryBreakdown || []).reduce((acc, cat) => {
    acc[cat.category] = cat;
    return acc;
  }, {});

  const categoryListToRender = CATEGORY_DEFAULTS.map((def) => {
    const existing = categoryDataMap[def.category];
    return {
      category: def.category,
      recycledPickupsCount: existing?.recycledPickupsCount ?? 0,
      recycledWeightKg: existing?.recycledWeightKg ?? 0,
      co2SavedKg: existing?.co2SavedKg ?? 0,
      conversionFactor: existing?.conversionFactor ?? def.conversionFactor,
    };
  });

  return (
    <div className="dashboard-overview-wrapper">
      {/* Welcome & Refresh Banner */}
      <section className="welcome-banner-card">
        <div className="welcome-text">
          <h2 style={{ color: '#000000', margin: 0, fontSize: '1.5rem', fontWeight: 800 }}>
            System Dashboard & Overview
          </h2>
          <p>Real-time WasteZero platform metrics, pickup lifecycle statistics, and environmental impact data.</p>
        </div>
        <button
          className="btn-primary-action"
          onClick={() => dispatch(fetchAdminStats())}
        >
          <AutorenewIcon fontSize="small" />
          Refresh Statistics
        </button>
      </section>

      {error && <Alert severity="error" sx={{ borderRadius: '12px' }}>{error}</Alert>}

      {/* Core KPI Statistics Grid */}
      <section className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon-box total">
            <PeopleIcon />
          </div>
          <div className="stat-details">
            <span className="stat-label">Total Users</span>
            <span className="stat-value">{stats?.totalUsers ?? 0}</span>
            <span className="text-muted-xs" style={{ marginTop: '2px' }}>
              {stats?.totalCustomers ?? 0} Cust | {stats?.totalCollectors ?? 0} Coll
            </span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-box completed">
            <LocalShippingIcon />
          </div>
          <div className="stat-details">
            <span className="stat-label">Active Collectors</span>
            <span className="stat-value">{stats?.activeCollectors ?? 0}</span>
            <span className="text-muted-xs" style={{ color: '#059669', marginTop: '2px', fontWeight: 600 }}>
              Eligible for assignment
            </span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-box total">
            <DeleteSweepIcon />
          </div>
          <div className="stat-details">
            <span className="stat-label">Total Pickups</span>
            <span className="stat-value">{stats?.totalPickups ?? 0}</span>
            <span className="text-muted-xs" style={{ marginTop: '2px' }}>
              {stats?.recycledPickups ?? 0} Recycled
            </span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-box cancelled">
            <ReportProblemIcon />
          </div>
          <div className="stat-details">
            <span className="stat-label">Open Complaints</span>
            <span className="stat-value">{stats?.openComplaints ?? 0}</span>
            <span className="text-muted-xs" style={{ color: '#DC2626', marginTop: '2px', fontWeight: 600 }}>
              {stats?.underReviewComplaints ?? 0} In Review
            </span>
          </div>
        </div>
      </section>

      {/* Pickup Lifecycle Breakdown Section */}
      <div className="quick-actions-card" style={{ border: '1.5px solid #CBD5E1' }}>
        <h3 className="section-title" style={{ color: '#000000' }}>Pickup Lifecycle Breakdown</h3>
        <div className="stats-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))' }}>
          <div className="stat-card" style={{ padding: '14px 16px' }}>
            <div className="stat-icon-box pending" style={{ width: '40px', height: '40px', fontSize: '20px' }}>
              <HourglassEmptyIcon />
            </div>
            <div className="stat-details">
              <span className="stat-label">Pending</span>
              <span className="stat-value" style={{ fontSize: '1.3rem' }}>{stats?.pendingPickups ?? 0}</span>
            </div>
          </div>

          <div className="stat-card" style={{ padding: '14px 16px' }}>
            <div className="stat-icon-box total" style={{ width: '40px', height: '40px', fontSize: '20px' }}>
              <LocalShippingIcon />
            </div>
            <div className="stat-details">
              <span className="stat-label">Active Work</span>
              <span className="stat-value" style={{ fontSize: '1.3rem' }}>{stats?.activePickups ?? 0}</span>
            </div>
          </div>

          <div className="stat-card" style={{ padding: '14px 16px' }}>
            <div className="stat-icon-box completed" style={{ width: '40px', height: '40px', fontSize: '20px' }}>
              <CheckCircleOutlinedIcon />
            </div>
            <div className="stat-details">
              <span className="stat-label">Collected</span>
              <span className="stat-value" style={{ fontSize: '1.3rem' }}>{stats?.collectedPickups ?? 0}</span>
            </div>
          </div>

          <div className="stat-card" style={{ padding: '14px 16px' }}>
            <div className="stat-icon-box completed" style={{ width: '40px', height: '40px', fontSize: '20px', backgroundColor: '#DCFCE7', color: '#166534' }}>
              <RecyclingIcon />
            </div>
            <div className="stat-details">
              <span className="stat-label">Recycled</span>
              <span className="stat-value" style={{ fontSize: '1.3rem', color: '#166534' }}>{stats?.recycledPickups ?? 0}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Environmental Impact Metrics Card */}
      <div className="active-pickup-card">
        <div className="active-card-header">
          <div className="header-badge-group">
            <RecyclingIcon style={{ color: '#A7F3D0', fontSize: '28px' }} />
            <div>
              <h3 className="active-category-title" style={{ color: '#FFFFFF' }}>Environmental Impact Overview</h3>
              <p style={{ margin: 0, fontSize: '0.85rem', color: 'rgba(255, 255, 255, 0.85)' }}>Aggregated impact calculated on finalized RECYCLED waste.</p>
            </div>
          </div>
          <span className="status-chip chip-recycled" style={{ fontSize: '0.85rem', padding: '6px 14px' }}>
            Total Recycled: {stats?.totalWasteRecycled ?? 0} kg
          </span>
        </div>

        <div className="active-info-row" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', backgroundColor: '#FFFFFF', padding: '24px' }}>
          <div className="info-item">
            <span className="info-label"><Co2Icon style={{ color: '#38BDF8', fontSize: '20px' }} /> Estimated CO₂ Saved</span>
            <span className="info-value" style={{ fontSize: '1.4rem', color: '#0F172A' }}>{stats?.estimatedCo2Saved ?? 0} kg</span>
          </div>

          <div className="info-item">
            <span className="info-label"><ParkIcon style={{ color: '#4ADE80', fontSize: '20px' }} /> Equivalent Trees Saved</span>
            <span className="info-value" style={{ fontSize: '1.4rem', color: '#0F172A' }}>{stats?.estimatedTreesSaved ?? 0} trees/yr</span>
          </div>

          <div className="info-item">
            <span className="info-label"><WaterDropIcon style={{ color: '#60A5FA', fontSize: '20px' }} /> Water Saved</span>
            <span className="info-value" style={{ fontSize: '1.4rem', color: '#0F172A' }}>{stats?.estimatedWaterSaved ?? 0} Liters</span>
          </div>

          <div className="info-item">
            <span className="info-label"><BoltIcon style={{ color: '#FACC15', fontSize: '20px' }} /> Energy Saved</span>
            <span className="info-value" style={{ fontSize: '1.4rem', color: '#0F172A' }}>{stats?.estimatedEnergySaved ?? 0} kWh</span>
          </div>
        </div>
      </div>

      {/* Recycled Waste Breakdown by Category */}
      <div className="recent-pickups-card" style={{ border: '1.5px solid #CBD5E1' }}>
        <div className="card-top-bar">
          <h3 className="section-title" style={{ color: '#000000' }}>Recycled Waste Breakdown by Category</h3>
        </div>
        <div style={{ padding: '20px' }}>
          <div className="stats-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))' }}>
            {categoryListToRender.map((cat) => (
              <div
                key={cat.category}
                className="stat-card"
                style={{
                  flexDirection: 'column',
                  alignItems: 'flex-start',
                  padding: '16px',
                  border: '1.5px solid #94A3B8',
                  backgroundColor: '#FFFFFF',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
                  <span className="font-semibold" style={{ fontSize: '0.95rem', color: '#000000' }}>{cat.category}</span>
                  <span className="status-chip chip-default" style={{ fontSize: '0.7rem' }}>{cat.recycledPickupsCount} pickups</span>
                </div>
                <span className="stat-value" style={{ color: '#395F51', fontSize: '1.4rem', margin: '6px 0 2px 0' }}>
                  {cat.recycledWeightKg} kg
                </span>
                <span className="text-muted-xs">CO₂ Saved: {cat.co2SavedKg} kg ({cat.conversionFactor}x factor)</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Navigation Shortcuts */}
      <div className="quick-actions-card" style={{ border: '1.5px solid #CBD5E1' }}>
        <h3 className="section-title" style={{ color: '#000000' }}>Administrative Management Shortcuts</h3>
        <div className="actions-button-group">
          <button className="btn-action-tile primary" onClick={() => navigate('/admin/pickups')}>
            Manage All Pickups <ArrowForwardIcon fontSize="small" />
          </button>
          <button className="btn-action-tile secondary" onClick={() => navigate('/admin/users')}>
            User Directory <ArrowForwardIcon fontSize="small" />
          </button>
          <button className="btn-action-tile secondary" onClick={() => navigate('/admin/complaints')}>
            Customer Complaints <ArrowForwardIcon fontSize="small" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardPage;
