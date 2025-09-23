import React, { useState, useEffect } from "react";
import { useLocation, useNavigate, Routes, Route } from "react-router-dom";
import SuperAdminSidebar from "./components/SuperAdminSidebar";
import SuperAdminHeader from "./components/SuperAdminHeader";
import "./SuperAdminLayout.css";

// Import all SuperAdmin pages
import SuperAdminDashboard from "./pages/SuperAdminDashboard/Dashboard";
import SuperAdminCustomers from "./pages/SuperAdminCustomers/CustomersPage";
import SuperAdminRestaurants from "./pages/SuperAdminRestaurants/RestaurantsPage";
import SuperAdminMenuItems from "./pages/SuperAdminMenuItems/MenuItemsPage";
import SuperAdminOrders from "./pages/SuperAdminOrders/OrdersPage";
import SuperAdminPayments from "./pages/SuperAdminPayments/PaymentsPage";
import SuperAdminOffers from "./pages/SuperAdminOffers/OffersPage";
import SuperAdminFeedback from "./pages/SuperAdminFeedback/FeedbackPage";
import SuperAdminSettings from "./pages/SuperAdminSettings/SettingsPage";

export default function SuperAdminLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [themeColor, setThemeColor] = useState("#667eea");
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    // Check authentication on mount
    const token = localStorage.getItem('superAdminToken');
    if (!token) {
      setIsAuthenticated(false);
      navigate('/super-admin/login');
      return;
    }
    
    setIsAuthenticated(true);
    
    // If user is on /super-admin without specific page, redirect to dashboard
    if (location.pathname === '/super-admin') {
      navigate('/super-admin/dashboard');
    }
  }, [location, navigate]);

  const handleSidebarToggle = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleThemeChange = (color) => {
    setThemeColor(color);
  };

  const toggleDarkMode = () => {
    setIsDarkMode((prev) => !prev);
  };

  // If not authenticated, show login page
  if (!isAuthenticated) {
    return null; // Let the main App.js handle the login redirect
  }

  return (
    <div className={`admin-layout ${isDarkMode ? "dark-mode" : ""}`}>
      {isSidebarOpen && (
        <SuperAdminSidebar themeColor={themeColor} darkMode={isDarkMode} />
      )}
      <div
        className={`admin-main ${isSidebarOpen ? "sidebar-open" : "sidebar-closed"}`}
      >
        <SuperAdminHeader
          onToggleSidebar={handleSidebarToggle}
          onThemeChange={handleThemeChange}
          onToggleDarkMode={toggleDarkMode}
          themeColor={themeColor}
          isDarkMode={isDarkMode}
        />
        <div className="admin-content">
          <Routes>
            {/* Dashboard */}
            <Route path="/dashboard" element={<SuperAdminDashboard themeColor={themeColor} isDarkMode={isDarkMode} />} />
            
            {/* Users */}
            <Route path="/users/*" element={<SuperAdminCustomers themeColor={themeColor} isDarkMode={isDarkMode} />} />
            
            {/* Restaurants */}
            <Route path="/restaurants/*" element={<SuperAdminRestaurants themeColor={themeColor} isDarkMode={isDarkMode} />} />
            
            {/* Menu Items */}
            <Route path="/menu-items/*" element={<SuperAdminMenuItems themeColor={themeColor} isDarkMode={isDarkMode} />} />
            
            {/* Orders */}
            <Route path="/orders/*" element={<SuperAdminOrders themeColor={themeColor} isDarkMode={isDarkMode} />} />
            
            {/* Payments & Invoice */}
            <Route path="/payments/*" element={<SuperAdminPayments themeColor={themeColor} isDarkMode={isDarkMode} />} />
            
            {/* Offers & Coupons */}
            <Route path="/offers/*" element={<SuperAdminOffers themeColor={themeColor} isDarkMode={isDarkMode} />} />
            
            
            
            {/* Feedback & Complaints */}
            <Route path="/feedback/*" element={<SuperAdminFeedback themeColor={themeColor} isDarkMode={isDarkMode} />} />
            
            {/* Settings */}
            <Route path="/settings" element={<SuperAdminSettings themeColor={themeColor} isDarkMode={isDarkMode} />} />
            
            {/* Default redirect to dashboard */}
            <Route path="*" element={<SuperAdminDashboard themeColor={themeColor} isDarkMode={isDarkMode} />} />
          </Routes>
        </div>
      </div>
    </div>
  );
}
