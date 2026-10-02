import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import AutorenewIcon from '@mui/icons-material/Autorenew';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PeopleOutlinedIcon from '@mui/icons-material/PeopleOutlined';
import LocalShippingOutlinedIcon from '@mui/icons-material/LocalShippingOutlined';
import DeleteSweepOutlinedIcon from '@mui/icons-material/DeleteSweepOutlined';
import ReportProblemOutlinedIcon from '@mui/icons-material/ReportProblemOutlined';
import PersonOutlinedIcon from '@mui/icons-material/PersonOutlined';
import LogoutIcon from '@mui/icons-material/Logout';
import CloseIcon from '@mui/icons-material/Close';

const AdminSidebar = ({ mobileOpen, onMobileClose }) => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { label: 'Dashboard', path: '/admin/dashboard', icon: <DashboardIcon />, end: true },
    { label: 'Users', path: '/admin/users', icon: <PeopleOutlinedIcon />, end: true },
    { label: 'Pickups', path: '/admin/pickups', icon: <DeleteSweepOutlinedIcon />, end: true },
    { label: 'Complaints', path: '/admin/complaints', icon: <ReportProblemOutlinedIcon />, end: true },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div
          className="customer-sidebar-overlay"
          onClick={onMobileClose}
          aria-hidden="true"
        />
      )}

      <aside className={`customer-sidebar ${mobileOpen ? 'mobile-open' : ''}`}>
        {/* Brand Header */}
        <div className="sidebar-brand">
          <div className="brand-logo-box">
            <AutorenewIcon className="brand-icon" />
            <span className="brand-title">WasteZero</span>
          </div>
          <button className="mobile-close-btn" onClick={onMobileClose} aria-label="Close Sidebar">
            <CloseIcon fontSize="small" />
          </button>
        </div>

        {/* Scrollable Navigation Area */}
        <div className="sidebar-scroll-area">
          <nav className="nav-group">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.end}
                className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
                onClick={onMobileClose}
              >
                <span className="nav-icon">{item.icon}</span>
                <span className="nav-label" style={{ flex: 1 }}>{item.label}</span>
              </NavLink>
            ))}
          </nav>
        </div>

        {/* Pinned Bottom Section */}
        <div className="sidebar-bottom-section">
          <div className="nav-divider" />
          <NavLink
            to="/admin/profile"
            end
            className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
            onClick={onMobileClose}
          >
            <span className="nav-icon"><PersonOutlinedIcon /></span>
            <span className="nav-label">Profile</span>
          </NavLink>

          <button className="nav-item logout-item" onClick={handleLogout}>
            <span className="nav-icon"><LogoutIcon /></span>
            <span className="nav-label">Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default AdminSidebar;
