import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import CustomerLayout from '../components/customer/CustomerLayout';
import CustomerDashboardOverview from './customer/CustomerDashboardOverview';
import CustomerPickupsList from './customer/CustomerPickupsList';
import CreatePickupPage from './customer/CreatePickupPage';
import PickupDetailPage from './customer/PickupDetailPage';
import CustomerNotificationsPage from './customer/CustomerNotificationsPage';
import CustomerImpactPage from './customer/CustomerImpactPage';
import CustomerComplaintsPage from './customer/CustomerComplaintsPage';
import CustomerProfilePage from './customer/CustomerProfilePage';

const CustomerDashboard = () => {
  return (
    <Routes>
      <Route element={<CustomerLayout />}>
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<CustomerDashboardOverview />} />
        <Route path="pickups" element={<CustomerPickupsList />} />
        <Route path="pickups/new" element={<CreatePickupPage />} />
        <Route path="pickups/:id" element={<PickupDetailPage />} />
        <Route path="notifications" element={<CustomerNotificationsPage />} />
        <Route path="impact" element={<CustomerImpactPage />} />
        <Route path="complaints" element={<CustomerComplaintsPage />} />
        <Route path="profile" element={<CustomerProfilePage />} />
        <Route path="*" element={<Navigate to="dashboard" replace />} />
      </Route>
    </Routes>
  );
};

export default CustomerDashboard;
