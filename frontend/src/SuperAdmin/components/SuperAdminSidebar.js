import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import {
  FaTachometerAlt, 
  FaUsers, 
  FaStore, 
  FaUtensils, 
  FaShoppingCart, 
  FaFileInvoice, 
  FaGift, 
  FaMapMarkerAlt, 
  FaComments, 
  FaCog, 
  FaSignOutAlt,
  FaChevronDown,
  FaChevronRight
} from "react-icons/fa";
import "./SuperAdminSidebar.css";

export default function SuperAdminSidebar({ themeColor, darkMode }) {
  const [expandedMenus, setExpandedMenus] = useState({
    users: false,
    restaurants: false,
    menuItems: false,
    orders: false,
    payments: false,
    offers: false,
    locations: false,
    feedback: false
  });

  const toggleMenu = (menuKey) => {
    setExpandedMenus(prev => ({
      ...prev,
      [menuKey]: !prev[menuKey]
    }));
  };

  const handleLogout = () => {
    localStorage.removeItem('superAdminToken');
    localStorage.removeItem('superAdminData');
    window.location.href = '/super-admin/login';
  };

  return (
    <div className={`admin-sidebar ${darkMode ? 'dark-mode' : ''}`} style={{ background: themeColor }}>
      <div className="sidebar-header">
        <h3>Super Admin</h3>
      </div>
      
      <ul className="sidebar-menu">
        {/* Dashboard */}
        <li className="menu-item">
          <NavLink to="/super-admin/dashboard" className="menu-link">
            <FaTachometerAlt className="menu-icon" />
            <span>Dashboard</span>
          </NavLink>
        </li>

        {/* Users */}
        <li className="menu-item">
          <div className="menu-link" onClick={() => toggleMenu('users')}>
            <FaUsers className="menu-icon" />
            <span>Users</span>
            {expandedMenus.users ? <FaChevronDown className="arrow-icon" /> : <FaChevronRight className="arrow-icon" />}
          </div>
          {expandedMenus.users && (
            <ul className="submenu">
              <li><NavLink to="/super-admin/users/customers">Customers</NavLink></li>
            </ul>
          )}
        </li>

        {/* Restaurants */}
        <li className="menu-item">
          <div className="menu-link" onClick={() => toggleMenu('restaurants')}>
            <FaStore className="menu-icon" />
            <span>Restaurants</span>
            {expandedMenus.restaurants ? <FaChevronDown className="arrow-icon" /> : <FaChevronRight className="arrow-icon" />}
          </div>
          {expandedMenus.restaurants && (
            <ul className="submenu">
              <li><NavLink to="/super-admin/restaurants/all">All Restaurants</NavLink></li>
            </ul>
          )}
        </li>

        {/* Menu Items */}
        <li className="menu-item">
          <div className="menu-link" onClick={() => toggleMenu('menuItems')}>
            <FaUtensils className="menu-icon" />
            <span>Menu Items</span>
            {expandedMenus.menuItems ? <FaChevronDown className="arrow-icon" /> : <FaChevronRight className="arrow-icon" />}
          </div>
          {expandedMenus.menuItems && (
            <ul className="submenu">
              <li><NavLink to="/super-admin/menu-items/all">All Items</NavLink></li>
              {/* <li><NavLink to="/super-admin/menu-items/pending">Pending Approval</NavLink></li>
              <li><NavLink to="/super-admin/menu-items/categories">Categories</NavLink></li> */}
            </ul>
          )}
        </li>

        {/* Orders */}
        <li className="menu-item">
          <div className="menu-link" onClick={() => toggleMenu('orders')}>
            <FaShoppingCart className="menu-icon" />
            <span>Orders</span>
            {expandedMenus.orders ? <FaChevronDown className="arrow-icon" /> : <FaChevronRight className="arrow-icon" />}
          </div>
          {expandedMenus.orders && (
            <ul className="submenu">
              <li><NavLink to="/super-admin/orders/all">All Orders</NavLink></li>
              {/* <li><NavLink to="/super-admin/orders/completed">Completed</NavLink></li>
              <li><NavLink to="/super-admin/orders/cancelled">Cancelled</NavLink></li>
              <li><NavLink to="/super-admin/orders/ongoing">Ongoing</NavLink></li> */}
            </ul>
          )}
        </li>

        {/* Payments / Invoice */}
        <li className="menu-item">
          <div className="menu-link" onClick={() => toggleMenu('payments')}>
            <FaFileInvoice className="menu-icon" />
            <span>Payments & Invoice</span>
            {expandedMenus.payments ? <FaChevronDown className="arrow-icon" /> : <FaChevronRight className="arrow-icon" />}
          </div>
          {expandedMenus.payments && (
            <ul className="submenu">
              <li><NavLink to="/super-admin/payments/restaurant-payments">Restaurant Payments</NavLink></li>
              {/* <li><NavLink to="/super-admin/payments/commissions">Commissions</NavLink></li> */}
              <li><NavLink to="/super-admin/payments/invoices">Invoices</NavLink></li>
            </ul>
          )}
        </li>

        {/* Offers / Coupons */}
        {/* <li className="menu-item">
          <div className="menu-link" onClick={() => toggleMenu('offers')}>
            <FaGift className="menu-icon" />
            <span>Offers & Coupons</span>
            {expandedMenus.offers ? <FaChevronDown className="arrow-icon" /> : <FaChevronRight className="arrow-icon" />}
          </div>
          {expandedMenus.offers && (
            <ul className="submenu">
              <li><NavLink to="/super-admin/offers/all">All Offers</NavLink></li>
              <li><NavLink to="/super-admin/offers/add">Add New Offer</NavLink></li>
              <li><NavLink to="/super-admin/offers/restaurant-specific">Restaurant Specific</NavLink></li>
              <li><NavLink to="/super-admin/offers/usage-tracking">Usage Tracking</NavLink></li>
            </ul>
          )}
        </li> */}

        {/* Locations */}
        {/* <li className="menu-item">
          <div className="menu-link" onClick={() => toggleMenu('locations')}>
            <FaMapMarkerAlt className="menu-icon" />
            <span>Locations</span>
            {expandedMenus.locations ? <FaChevronDown className="arrow-icon" /> : <FaChevronRight className="arrow-icon" />}
          </div>
          {expandedMenus.locations && (
            <ul className="submenu">
              <li><NavLink to="/super-admin/locations/delivery-zones">Delivery Zones</NavLink></li>
              <li><NavLink to="/super-admin/locations/cities">Cities</NavLink></li>
            </ul>
          )}
        </li> */}

        {/* Feedback & Complaints */}
        <li className="menu-item">
          <div className="menu-link" onClick={() => toggleMenu('feedback')}>
            <FaComments className="menu-icon" />
            <span>Feedback & Complaints</span>
            {expandedMenus.feedback ? <FaChevronDown className="arrow-icon" /> : <FaChevronRight className="arrow-icon" />}
          </div>
          {expandedMenus.feedback && (
            <ul className="submenu">
              {/* <li><NavLink to="/super-admin/feedback/complaints">Complaints</NavLink></li> */}
              <li><NavLink to="/super-admin/feedback/reviews">Reviews & Ratings</NavLink></li>
            </ul>
          )}
        </li>

        {/* Settings */}
        <li className="menu-item">
          <NavLink to="/super-admin/settings" className="menu-link">
            <FaCog className="menu-icon" />
            <span>Settings</span>
          </NavLink>
        </li>
      </ul>

      {/* <div className="sidebar-bottom">
        <button onClick={handleLogout} className="logout-btn">
          <FaSignOutAlt className="menu-icon" />
          <span>Logout</span>
        </button>
      </div> */}
    </div>
  );
}
