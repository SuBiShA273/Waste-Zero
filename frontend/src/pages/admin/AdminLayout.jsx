import React, { useState } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import AdminSidebar from '../../components/admin/AdminSidebar';
import AdminHeader from '../../components/admin/AdminHeader';

// Admin Sub-pages
import AdminDashboardPage from './AdminDashboardPage';
import AdminUsersPage from './AdminUsersPage';
import AdminUserDetailsPage from './AdminUserDetailsPage';
import AdminCollectorsPage from './AdminCollectorsPage';
import AdminPickupsPage from './AdminPickupsPage';
import AdminPickupDetailsPage from './AdminPickupDetailsPage';
import AdminComplaintsPage from './AdminComplaintsPage';
import AdminComplaintDetailsPage from './AdminComplaintDetailsPage';
import AdminProfilePage from './AdminProfilePage';

const AdminLayout = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  const handleMobileToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleMobileClose = () => {
    setMobileOpen(false);
  };

  const getPageTitle = (pathname) => {
    if (pathname.includes('/admin/users/') && pathname.split('/').length === 4) return 'User Account Details';
    if (pathname.includes('/admin/users')) return 'User Management';
    if (pathname.includes('/admin/collectors')) return 'Collector Management';
    if (pathname.includes('/admin/pickups/') && pathname.split('/').length === 4) return 'Pickup Details';
    if (pathname.includes('/admin/pickups')) return 'Pickup Management';
    if (pathname.includes('/admin/complaints/') && pathname.split('/').length === 4) return 'Complaint Details';
    if (pathname.includes('/admin/complaints')) return 'Complaint Management';
    if (pathname.includes('/admin/profile')) return 'Admin Profile';
    return 'Admin Dashboard';
  };

  const title = getPageTitle(location.pathname);

  return (
    <div className="customer-layout-root">
      <AdminSidebar mobileOpen={mobileOpen} onMobileClose={handleMobileClose} />

      <div className="customer-main-area">
        <AdminHeader onMobileToggle={handleMobileToggle} title={title} />

        <main className="customer-content-body">
          <Routes>
            <Route path="/" element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<AdminDashboardPage />} />
            <Route path="users" element={<AdminUsersPage />} />
            <Route path="users/:id" element={<AdminUserDetailsPage />} />
            <Route path="collectors" element={<AdminCollectorsPage />} />
            <Route path="pickups" element={<AdminPickupsPage />} />
            <Route path="pickups/:id" element={<AdminPickupDetailsPage />} />
            <Route path="complaints" element={<AdminComplaintsPage />} />
            <Route path="complaints/:id" element={<AdminComplaintDetailsPage />} />
            <Route path="profile" element={<AdminProfilePage />} />
            <Route path="*" element={<Navigate to="dashboard" replace />} />
          </Routes>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
