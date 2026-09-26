import React from 'react';
import { useNavigate } from 'react-router-dom';
import AutorenewIcon from '@mui/icons-material/Autorenew';

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="landing-container">
      {/* Top Navbar Header */}
      <header className="landing-header">
        <div className="landing-logo-box" onClick={() => navigate('/')}>
          <AutorenewIcon className="landing-logo-icon" />
          <span className="landing-logo-text">WasteZero</span>
        </div>
      </header>

      {/* Centered Hero Content */}
      <main className="landing-hero">
        <h1 className="landing-title">
          &quot;Waste isn&apos;t waste until we waste it.&quot;
        </h1>

        <p className="landing-subtitle">
          Join our smart pickup platform to build a cleaner, circular future for our communities.
        </p>

        {/* Action Buttons */}
        <div className="landing-actions">
          <button className="btn-login" onClick={() => navigate('/login')}>
            Login
          </button>

          <button className="btn-register" onClick={() => navigate('/register')}>
            Register
          </button>
        </div>
      </main>

      {/* Subtle Bottom Spacer */}
      <footer className="landing-spacer" />
    </div>
  );
};

export default LandingPage;
