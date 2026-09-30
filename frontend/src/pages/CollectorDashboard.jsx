import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import CollectorLayout from '../components/collector/CollectorLayout';
import CollectorDashboardOverview from './collector/CollectorDashboardOverview';
import CollectorPickupsListPage from './collector/CollectorPickupsListPage';
import CollectorPickupDetailPage from './collector/CollectorPickupDetailPage';
import CollectorHistoryPage from './collector/CollectorHistoryPage';
import CollectorProfilePage from './collector/CollectorProfilePage';

const CollectorDashboard = () => {
  return (
    <Routes>
      <Route element={<CollectorLayout />}>
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<CollectorDashboardOverview />} />
        <Route path="pickups" element={<CollectorPickupsListPage />} />
        <Route path="pickups/:id" element={<CollectorPickupDetailPage />} />
        <Route path="history" element={<CollectorHistoryPage />} />
        <Route path="profile" element={<CollectorProfilePage />} />
        <Route path="*" element={<Navigate to="dashboard" replace />} />
      </Route>
    </Routes>
  );
};

export default CollectorDashboard;
