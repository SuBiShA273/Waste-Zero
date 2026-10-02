import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import MenuIcon from '@mui/icons-material/Menu';
import Avatar from '@mui/material/Avatar';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import Divider from '@mui/material/Divider';
import LogoutIcon from '@mui/icons-material/Logout';
import PersonIcon from '@mui/icons-material/Person';
import DashboardIcon from '@mui/icons-material/Dashboard';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';

import { formatName } from '../../utils/formatters';

const AdminHeader = ({ onMobileToggle, title }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    handleMenuClose();
    logout();
    navigate('/login');
  };

  const handleProfile = () => {
    handleMenuClose();
    navigate('/admin/profile');
  };

  const getInitials = (name) => {
    if (!name) return 'A';
    const parts = name.trim().split(/\s+/);
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return name[0].toUpperCase();
  };

  return (
    <header className="customer-header">
      <div className="header-left">
        <button className="mobile-toggle-btn" onClick={onMobileToggle} aria-label="Open Navigation">
          <MenuIcon />
        </button>
        <h1 className="header-title">{title || 'Admin Portal'}</h1>
      </div>

      <div className="header-right">
        <div className="user-profile-trigger" onClick={handleMenuOpen}>
          <Avatar className="user-avatar" sx={{ bgcolor: '#395F51', width: 36, height: 36, fontSize: '0.9rem', fontWeight: 700 }}>
            {getInitials(user?.name)}
          </Avatar>
          <div className="user-info-text">
            <span className="user-name">{formatName(user?.name || 'Administrator')}</span>
            <span className="user-role">System Admin</span>
          </div>
          <KeyboardArrowDownIcon className="dropdown-arrow" fontSize="small" />
        </div>

        <Menu
          anchorEl={anchorEl}
          open={open}
          onClose={handleMenuClose}
          onClick={handleMenuClose}
          PaperProps={{
            elevation: 4,
            sx: {
              mt: 1.5,
              minWidth: 220,
              borderRadius: '12px',
              border: '1.5px solid #CBD5E1',
              padding: '0',
              overflow: 'hidden',
              boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.05)',
            },
          }}
          transformOrigin={{ horizontal: 'right', vertical: 'top' }}
          anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        >
          {/* User Info Header in Dropdown Menu */}
          <div style={{ padding: '14px 16px', borderBottom: '1px solid #E2E8F0', backgroundColor: '#F8FAFC' }}>
            <p style={{ margin: 0, fontWeight: 800, fontSize: '0.9rem', color: '#0F172A' }}>{formatName(user?.name || 'Administrator')}</p>
            <p style={{ margin: '2px 0 6px 0', fontSize: '0.775rem', color: '#64748B' }}>{user?.email || ''}</p>
            <span style={{ display: 'inline-block', padding: '2px 8px', borderRadius: '10px', fontSize: '0.7rem', fontWeight: 700, backgroundColor: '#F3E8FF', color: '#7E22CE', border: '1px solid #E9D5FF', textTransform: 'uppercase' }}>
              Admin Account
            </span>
          </div>

          <div style={{ padding: '4px 0' }}>
            <MenuItem onClick={handleProfile} sx={{ padding: '10px 16px', fontSize: '0.9rem', fontWeight: 600, color: '#334155', '&:hover': { backgroundColor: '#F1F5F9', color: '#395F51' } }}>
              <ListItemIcon sx={{ color: '#395F51', minWidth: '32px !important' }}>
                <PersonIcon fontSize="small" />
              </ListItemIcon>
              Admin Profile
            </MenuItem>

            <MenuItem onClick={() => { handleMenuClose(); navigate('/admin/dashboard'); }} sx={{ padding: '10px 16px', fontSize: '0.9rem', fontWeight: 600, color: '#334155', '&:hover': { backgroundColor: '#F1F5F9', color: '#395F51' } }}>
              <ListItemIcon sx={{ color: '#395F51', minWidth: '32px !important' }}>
                <DashboardIcon fontSize="small" />
              </ListItemIcon>
              Dashboard
            </MenuItem>

            <Divider sx={{ my: 0.5 }} />

            <MenuItem onClick={handleLogout} sx={{ padding: '10px 16px', fontSize: '0.9rem', fontWeight: 600, color: '#DC2626', '&:hover': { backgroundColor: '#FEF2F2' } }}>
              <ListItemIcon sx={{ color: '#DC2626', minWidth: '32px !important' }}>
                <LogoutIcon fontSize="small" />
              </ListItemIcon>
              Logout
            </MenuItem>
          </div>
        </Menu>
      </div>
    </header>
  );
};

export default AdminHeader;
