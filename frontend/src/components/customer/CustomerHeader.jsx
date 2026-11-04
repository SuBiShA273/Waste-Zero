import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import MenuIcon from '@mui/icons-material/Menu';
import Avatar from '@mui/material/Avatar';
import LogoutIcon from '@mui/icons-material/Logout';
import PersonIcon from '@mui/icons-material/Person';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';

import { formatName } from '../../utils/formatters';

const CustomerHeader = ({ onMobileToggle, title }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);

  const handleMenuToggle = () => setOpen((prev) => !prev);
  const handleMenuClose = () => setOpen(false);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    handleMenuClose();
    logout();
    navigate('/login');
  };

  const handleProfile = () => {
    handleMenuClose();
    navigate('/customer/profile');
  };

  const getInitials = (name) => {
    if (!name) return 'C';
    const parts = name.trim().split(/\s+/);
    if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    return name[0].toUpperCase();
  };

  return (
    <header className="customer-header">
      <div className="header-left">
        <button className="mobile-toggle-btn" onClick={onMobileToggle} aria-label="Open Navigation">
          <MenuIcon />
        </button>
        <h1 className="header-title">{title || 'Customer Portal'}</h1>
      </div>

      <div className="header-right">
        <div ref={dropdownRef} style={{ position: 'relative' }}>
          {/* Trigger */}
          <div className="user-profile-trigger" onClick={handleMenuToggle}>
            <Avatar sx={{ bgcolor: '#395F51', width: 36, height: 36, fontSize: '0.9rem', fontWeight: 700 }}>
              {getInitials(user?.name)}
            </Avatar>
            <div className="user-info-text">
              <span className="user-name">{formatName(user?.name)}</span>
              <span className="user-role">Customer</span>
            </div>
            <KeyboardArrowDownIcon className="dropdown-arrow" fontSize="small" />
          </div>

          {/* Custom Dropdown */}
          {open && (
            <div style={{
              position: 'absolute',
              top: 'calc(100% + 10px)',
              right: 0,
              minWidth: '220px',
              backgroundColor: '#FFFFFF',
              border: '1.5px solid #CBD5E1',
              borderRadius: '12px',
              boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1), 0 8px 10px -6px rgba(0,0,0,0.05)',
              overflow: 'hidden',
              zIndex: 200,
            }}>
              {/* User info header */}
              <div style={{ padding: '14px 16px', borderBottom: '1px solid #E2E8F0', backgroundColor: '#F8FAFC' }}>
                <p style={{ margin: 0, fontWeight: 800, fontSize: '0.9rem', color: '#0F172A' }}>
                  {formatName(user?.name)}
                </p>
                <p style={{ margin: '2px 0 6px 0', fontSize: '0.775rem', color: '#64748B' }}>
                  {user?.email || ''}
                </p>
                <span style={{
                  display: 'inline-block', padding: '2px 8px', borderRadius: '10px',
                  fontSize: '0.7rem', fontWeight: 700,
                  backgroundColor: '#F2F6F4', color: '#395F51',
                  border: '1px solid #C2D6CD', textTransform: 'uppercase',
                }}>
                  Customer Account
                </span>
              </div>

              {/* Menu items */}
              <div style={{ padding: '4px 0' }}>
                <button
                  onClick={handleProfile}
                  style={{
                    width: '100%', display: 'flex', alignItems: 'center', gap: '10px',
                    padding: '10px 16px', background: 'none', border: 'none', cursor: 'pointer',
                    fontSize: '0.9rem', fontWeight: 600, color: '#334155', textAlign: 'left',
                    transition: 'background-color 0.15s ease',
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#F1F5F9'; e.currentTarget.style.color = '#395F51'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = '#334155'; }}
                >
                  <PersonIcon fontSize="small" style={{ color: '#395F51' }} />
                  Profile
                </button>

                <div style={{ height: '1px', backgroundColor: '#E2E8F0', margin: '4px 0' }} />

                <button
                  onClick={handleLogout}
                  style={{
                    width: '100%', display: 'flex', alignItems: 'center', gap: '10px',
                    padding: '10px 16px', background: 'none', border: 'none', cursor: 'pointer',
                    fontSize: '0.9rem', fontWeight: 600, color: '#DC2626', textAlign: 'left',
                    transition: 'background-color 0.15s ease',
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#FEF2F2'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}
                >
                  <LogoutIcon fontSize="small" style={{ color: '#DC2626' }} />
                  Logout
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default CustomerHeader;
