import React, { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import CustomerSidebar from './CustomerSidebar';
import CustomerHeader from './CustomerHeader';

const CustomerLayout = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  const handleMobileToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleMobileClose = () => {
    setMobileOpen(false);
  };

  // Determine title based on path
  const getPageTitle = (pathname) => {
    if (pathname.includes('/customer/pickups/new')) return 'Request Waste Pickup';
    if (pathname.includes('/customer/pickups/') && pathname.split('/').length === 4) return 'Pickup Details';
    if (pathname.includes('/customer/pickups')) return 'My Pickups';
    if (pathname.includes('/customer/notifications')) return 'Notifications';
    if (pathname.includes('/customer/impact')) return 'Environmental Impact';
    if (pathname.includes('/customer/complaints')) return 'Complaints';
    if (pathname.includes('/customer/profile')) return 'Customer Profile';
    return 'Customer Dashboard';
  };

  const title = getPageTitle(location.pathname);

  return (
    <div className="customer-layout-root">
      <CustomerSidebar mobileOpen={mobileOpen} onMobileClose={handleMobileClose} />
      
      <div className="customer-main-area">
        <CustomerHeader onMobileToggle={handleMobileToggle} title={title} />
        
        <main className="customer-content-body">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default CustomerLayout;
