import React from 'react';
import { FaCog } from 'react-icons/fa';
import './SettingsPage.css';

const SettingsPage = ({ themeColor, isDarkMode }) => {
  return (
    <div className={`settings-page ${isDarkMode ? 'dark-mode' : ''}`}>
      <div className="page-header">
        <h1>Settings</h1>
        <p>Manage system configuration and profile settings</p>
      </div>

      <div className="settings-content">
        <div className="coming-soon">
          <FaCog />
          <h3>Settings Management</h3>
          <p>This feature is coming soon. You'll be able to:</p>
          <ul>
            <li>Update Super Admin profile</li>
            <li>Configure system settings</li>
            <li>Set delivery charges and tax rates</li>
            <li>Manage platform preferences</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage; 