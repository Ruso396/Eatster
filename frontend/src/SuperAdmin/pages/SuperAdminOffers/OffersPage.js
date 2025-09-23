import React from 'react';
import { FaGift } from 'react-icons/fa';
import './OffersPage.css';

const OffersPage = ({ themeColor, isDarkMode }) => {
  return (
    <div className={`offers-page ${isDarkMode ? 'dark-mode' : ''}`}>
      <div className="page-header">
        <h1>Offers & Coupons Management</h1>
        <p>Manage promotional offers and discount coupons</p>
      </div>

      <div className="offers-content">
        <div className="coming-soon">
          <FaGift />
          <h3>Offers & Coupons Management</h3>
          <p>This feature is coming soon. You'll be able to:</p>
          <ul>
            <li>Create new offers and coupons</li>
            <li>Manage restaurant-specific offers</li>
            <li>Track offer usage and performance</li>
            <li>Set discount rules and conditions</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default OffersPage; 