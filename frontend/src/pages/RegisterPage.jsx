import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  PersonOutlined as PersonOutlineIcon,
  EmailOutlined as MailOutlineIcon,
  PhoneOutlined as PhoneOutlinedIcon,
  LockOutlined as LockOutlinedIcon,
  BadgeOutlined as BadgeOutlinedIcon,
  Visibility,
  VisibilityOff,
} from '@mui/icons-material';

const RegisterPage = () => {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    role: 'CUSTOMER',
    password: '',
    confirmPassword: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.phone || !formData.password || !formData.confirmPassword) {
      setError('Please fill in all required fields.');
      return;
    }

    if (formData.name.trim().length < 2) {
      setError('Name must be at least 2 characters long.');
      return;
    }

    // Strict Email Validation Regex
    const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
    if (!emailRegex.test(formData.email)) {
      setError('Please enter a valid email address (e.g. user@example.com).');
      return;
    }

    // Strict Mobile / Phone Validation Regex (10 to 15 digits)
    const phoneRegex = /^\+?[0-9]{10,15}$/;
    if (!phoneRegex.test(formData.phone)) {
      setError('Please enter a valid 10 to 15 digit phone number (e.g. 9876543210 or +1234567890).');
      return;
    }

    // Strict Strong Password Validation Regex
    // Requires: >=8 chars, 1 uppercase, 1 lowercase, 1 digit, 1 special character
    const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&._\-#])[A-Za-z\d@$!%*?&._\-#]{8,}$/;
    if (!strongPasswordRegex.test(formData.password)) {
      setError('Password must be at least 8 characters long and contain an uppercase letter, lowercase letter, number, and special character (@$!%*?&._-#).');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const payload = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        role: formData.role,
        password: formData.password,
      };
      const res = await register(payload);
      const assignedRole = res.user?.role || formData.role;
      if (assignedRole === 'ADMIN') {
        navigate('/admin');
      } else if (assignedRole === 'COLLECTOR') {
        navigate('/collector');
      } else {
        navigate('/customer');
      }
    } catch (err) {
      const serverMessage = err.response?.data?.message;
      const validationErrors = err.response?.data?.errors;

      if (validationErrors) {
        const firstErrorKey = Object.keys(validationErrors)[0];
        setError(`${firstErrorKey}: ${validationErrors[firstErrorKey]}`);
      } else if (serverMessage) {
        setError(serverMessage);
      } else {
        setError('Registration failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      {/* Left Column - Registration Form */}
      <div className="auth-form-column">
        <div className="auth-form-wrapper">
          <h1 className="auth-title">Create an Account</h1>
          <p className="auth-subtitle">
            Join WasteZero today to schedule smart waste pickups for your community.
          </p>

          {error && <div className="auth-error-alert">{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <div className="input-container">
                <PersonOutlineIcon className="input-icon-left" />
                <input
                  type="text"
                  name="name"
                  className="auth-input-field"
                  placeholder="Full Name *"
                  value={formData.name}
                  onChange={handleChange}
                  disabled={loading}
                />
              </div>
            </div>

            <div className="form-group">
              <div className="input-container">
                <MailOutlineIcon className="input-icon-left" />
                <input
                  type="email"
                  name="email"
                  className="auth-input-field"
                  placeholder="Email Address (e.g. user@example.com) *"
                  value={formData.email}
                  onChange={handleChange}
                  disabled={loading}
                />
              </div>
            </div>

            <div className="form-group">
              <div className="input-container">
                <PhoneOutlinedIcon className="input-icon-left" />
                <input
                  type="text"
                  name="phone"
                  className="auth-input-field"
                  placeholder="Phone Number (e.g. 9876543210) *"
                  value={formData.phone}
                  onChange={handleChange}
                  disabled={loading}
                />
              </div>
            </div>

            {/* Role Selection Field */}
            <div className="form-group">
              <div className="input-container">
                <BadgeOutlinedIcon className="input-icon-left" />
                <select
                  name="role"
                  className="auth-input-field auth-select-field"
                  value={formData.role}
                  onChange={handleChange}
                  disabled={loading}
                >
                  <option value="CUSTOMER">Customer</option>
                  <option value="COLLECTOR">Collector</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <div className="input-container">
                <LockOutlinedIcon className="input-icon-left" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  className="auth-input-field"
                  placeholder="Password (min 8 chars, A-Z, a-z, 0-9, special) *"
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

            <div className="form-group">
              <div className="input-container">
                <LockOutlinedIcon className="input-icon-left" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="confirmPassword"
                  className="auth-input-field"
                  placeholder="Confirm Password *"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  disabled={loading}
                />
              </div>
            </div>

            <button type="submit" className="auth-submit-btn" disabled={loading}>
              {loading ? 'Creating Account...' : 'Create Account'}
            </button>

            <div className="auth-switch-text">
              Already have an account?{' '}
              <Link to="/login" className="auth-switch-link">
                Log in
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

export default RegisterPage;
