import React, { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import CollectorSidebar from './CollectorSidebar';
import CollectorHeader from './CollectorHeader';

const CollectorLayout = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  const handleMobileToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleMobileClose = () => {
    setMobileOpen(false);
  };

  const getPageTitle = (pathname) => {
    if (pathname.includes('/collector/pickups/') && pathname.split('/').length === 4) return 'Pickup Details';
    if (pathname.includes('/collector/pickups')) return 'Assigned Pickups';
    if (pathname.includes('/collector/history')) return 'Pickup History';
    if (pathname.includes('/collector/profile')) return 'Collector Profile';
    return 'Collector Dashboard';
  };

  const title = getPageTitle(location.pathname);

  return (
    <div className="customer-layout-root">
      <CollectorSidebar mobileOpen={mobileOpen} onMobileClose={handleMobileClose} />
      
      <div className="customer-main-area">
        <CollectorHeader onMobileToggle={handleMobileToggle} title={title} />
        
        <main className="customer-content-body">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default CollectorLayout;
