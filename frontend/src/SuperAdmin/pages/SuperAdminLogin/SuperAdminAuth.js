


import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUser, FaLock, FaEye, FaEyeSlash, FaShieldAlt } from 'react-icons/fa';
import Swal from 'sweetalert2';
import './SuperAdminAuth.css';

const SuperAdminAuth = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  
  const navigate = useNavigate();

  useEffect(() => {
    // Check if already logged in
    const token = localStorage.getItem('superAdminToken');
    if (token) {
      navigate('/super-admin/dashboard');
    }
  }, [navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // For demo purposes, accept specific credentials
      if (formData.email === 'superadmin@eatster.com' && formData.password === 'superadmin123') {
        // Store authentication data
        const superAdminData = {
          id: 1,
          name: 'Super Admin',
          email: formData.email,
          role: 'super_admin',
          permissions: ['all']
        };
        
        localStorage.setItem('superAdminToken', 'demo-super-admin-token');
        localStorage.setItem('superAdminData', JSON.stringify(superAdminData));
        
        Swal.fire({
          icon: 'success',
          title: 'Login Successful!',
          text: 'Welcome back, Super Admin!',
          timer: 2000,
          showConfirmButton: false
        });
        
        navigate('/super-admin/dashboard');
      } else {
        throw new Error('Invalid credentials');
      }
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Login Failed',
        text: error.message === 'Invalid credentials' 
          ? 'Invalid email or password. Please try again.' 
          : 'Something went wrong. Please try again.',
        confirmButtonColor: '#667eea'
      });
    } finally {
      setLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="super-admin-auth">
      <div className="auth-container">
        <div className="auth-header">
          <div className="logo-section">
            <FaShieldAlt className="logo-icon" />
            <h1>Super Admin</h1>
          </div>
          <p>Access the platform administration panel</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <div className="input-wrapper">
              <FaUser className="input-icon" />
              <input
                type="email"
                name="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleInputChange}
                className={errors.email ? 'error' : ''}
                disabled={loading}
              />
            </div>
            {errors.email && <span className="error-message">{errors.email}</span>}
          </div>

          <div className="form-group">
            <div className="input-wrapper">
              <FaLock className="input-icon" />
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleInputChange}
                className={errors.password ? 'error' : ''}
                disabled={loading}
              />
              <button
                type="button"
                className="password-toggle"
                onClick={togglePasswordVisibility}
                disabled={loading}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
            {errors.password && <span className="error-message">{errors.password}</span>}
          </div>

          <button
            type="submit"
            className={`submit-btn ${loading ? 'loading' : ''}`}
            disabled={loading}
          >
            {loading ? (
              <>
                <div className="spinner"></div>
                Signing In...
              </>
            ) : (
              'Sign In'
            )}
          </button>
        </form>

        <div className="auth-footer">
          <div className="demo-credentials">
            <h4>Demo Credentials:</h4>
            <p><strong>Email:</strong> superadmin@eatster.com</p>
            <p><strong>Password:</strong> superadmin123</p>
          </div>
          
          <div className="security-note">
            <p>
              <FaShieldAlt />
              This is a secure admin panel. Please keep your credentials safe.
            </p>
          </div>
        </div>
      </div>

      <div className="auth-background">
        <div className="background-shapes">
          <div className="shape shape-1"></div>
          <div className="shape shape-2"></div>
          <div className="shape shape-3"></div>
        </div>
      </div>
    </div>
  );
};

export default SuperAdminAuth;
