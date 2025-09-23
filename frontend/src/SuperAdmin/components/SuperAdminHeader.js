

import React, { useState, useEffect } from "react";
import "./SuperAdminHeader.css";
import { 
  FaBars, 
  FaSearch, 
  FaUserCircle, 
  FaBell, 
  FaPaintBrush, 
  FaCog, 
  FaSignOutAlt,
  FaUser,
  FaEdit,
  FaUpload
} from "react-icons/fa";

export default function SuperAdminHeader({ 
  onToggleSidebar, 
  onThemeChange, 
  onToggleDarkMode, 
  themeColor, 
  isDarkMode 
}) {
  const [showThemeDropdown, setShowThemeDropdown] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [superAdminData, setSuperAdminData] = useState(null);
  const [profileImage, setProfileImage] = useState(null);

  const themeColors = [
    "#e91e63", "#f44336", "#9c27b0", "#673ab7",
    "#3f51b5", "#2196f3", "#03a9f4", "#00bcd4",
    "#009688", "#4caf50", "#8bc34a", "#ff9800",
  ];

  useEffect(() => {
    // Load super admin data from localStorage
    const data = localStorage.getItem('superAdminData');
    if (data) {
      setSuperAdminData(JSON.parse(data));
    }
    
    // Load profile image from localStorage
    const savedImage = localStorage.getItem('superAdminProfileImage');
    if (savedImage) {
      setProfileImage(savedImage);
    }
  }, []);

  const toggleThemeDropdown = () => {
    setShowThemeDropdown(!showThemeDropdown);
    setShowProfileDropdown(false);
  };

  const toggleProfileDropdown = () => {
    setShowProfileDropdown(!showProfileDropdown);
    setShowThemeDropdown(false);
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
    // Implement search functionality here
  };

  const handleProfileImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageData = e.target.result;
        setProfileImage(imageData);
        localStorage.setItem('superAdminProfileImage', imageData);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('superAdminToken');
    localStorage.removeItem('superAdminData');
    localStorage.removeItem('superAdminProfileImage');
    window.location.href = '/super-admin/login';
  };

  const handleProfileEdit = () => {
    // Navigate to profile edit page
    window.location.href = '/super-admin/profile';
  };

  return (
    <header className={`admin-header ${isDarkMode ? 'dark-mode' : ''}`} style={{ background: themeColor }}>
      <div className="header-left">
        <button className="toggle-btn" onClick={onToggleSidebar}>
          <FaBars />
        </button>
      </div>

      <div className="header-center">
        <div className="search-wrapper">
          <FaSearch className="search-icon" />
          <input
            className="search-bar"
            type="text"
            placeholder="Search users, restaurants, orders..."
            value={searchQuery}
            onChange={handleSearch}
          />
        </div>
      </div>

      <div className="header-actions">
        <div className="notification-icon">
          <FaBell />
          <span className="notification-badge">3</span>
        </div>

        <div className="theme-icon" onClick={toggleThemeDropdown}>
          <FaPaintBrush />
          {showThemeDropdown && (
            <div className="theme-dropdown">
              {themeColors.map((color) => (
                <div
                  key={color}
                  className="theme-color"
                  style={{ backgroundColor: color }}
                  onClick={() => {
                    onThemeChange(color);
                    setShowThemeDropdown(false);
                  }}
                ></div>
              ))}
            </div>
          )}
        </div>

        <div className="profile-section">
          <div className="profile-icon" onClick={toggleProfileDropdown}>
            {profileImage ? (
              <img 
                src={profileImage} 
                alt="Profile" 
                className="profile-image"
              />
            ) : (
              <FaUserCircle />
            )}
          </div>
          
          {showProfileDropdown && (
            <div className="profile-dropdown">
              <div className="profile-info">
                <div className="profile-name">
                  {superAdminData?.name || 'Super Admin'}
                </div>
                <div className="profile-email">
                  {superAdminData?.email || 'superadmin@eatster.com'}
                </div>
              </div>
              
              <div className="profile-actions">
                <button className="profile-action-btn" onClick={handleProfileEdit}>
                  <FaUser />
                  <span>Profile</span>
                </button>
                
                <label className="profile-action-btn">
                  <FaUpload />
                  <span>Upload Photo</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleProfileImageUpload}
                    style={{ display: 'none' }}
                  />
                </label>
                
                <button className="profile-action-btn">
                  <FaCog />
                  <span>Settings</span>
                </button>
                
                <button className="profile-action-btn logout" onClick={handleLogout}>
                  <FaSignOutAlt />
                  <span>Logout</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
