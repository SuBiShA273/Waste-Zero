import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  EmailOutlined as MailOutlineIcon,
  LockOutlined as LockOutlinedIcon,
  Visibility,
  VisibilityOff,
} from '@mui/icons-material';

const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [formData, setFormData] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      setError('Please fill in all fields.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await login(formData);
      const role = res.user?.role;
      if (role === 'ADMIN') navigate('/admin');
      else if (role === 'COLLECTOR') navigate('/collector');
      else navigate('/customer');
    } catch (err) {
      const message =
        err.response?.data?.message ||
        'Invalid email or password. Please check your credentials.';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      {/* Left Column - Form */}
      <div className="auth-form-column">
        <div className="auth-form-wrapper">
          <h1 className="auth-title">Welcome back</h1>
          <p className="auth-subtitle">
            Login to WasteZero. Every choice, every action, leads to a world without waste.
          </p>

          {error && <div className="auth-error-alert">{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <div className="input-container">
                <MailOutlineIcon className="input-icon-left" />
                <input
                  type="email"
                  name="email"
                  className="auth-input-field"
                  placeholder="Email or Username"
                  value={formData.email}
                  onChange={handleChange}
                  disabled={loading}
                />
              </div>
            </div>

            <div className="form-group">
              <div className="input-container">
                <LockOutlinedIcon className="input-icon-left" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  className="auth-input-field"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleChange}
                  disabled={loading}
                />
                <button
                  type="button"
                  className="input-icon-right"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                </button>
              </div>
            </div>

            <button type="submit" className="auth-submit-btn" disabled={loading}>
              {loading ? 'Logging in...' : 'Log In'}
            </button>

            <div className="auth-forgot-link">Forgot your password?</div>

            <div className="auth-switch-text">
              Don&apos;t have an account?{' '}
              <Link to="/register" className="auth-switch-link">
                Sign up
              </Link>
            </div>
          </form>
        </div>
      </div>

      {/* Right Column - Image */}
      <div className="auth-image-column" />
    </div>
  );
};

export default LoginPage;
