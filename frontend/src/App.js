import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';

import Header from './components/HeaderItems/header';
import Footer from './components/Footer/Footer';
import './App.css';

import Home from './components/Home';
import Help from './components/HeaderItems/Help';
import Menu from './pages/menu/menu';
import LoginRegister from './pages/Login/Login';
import Buy from './pages/checkout/buy';
import PartnerUi from './pages/partner/PartnerUi';
import RestaurantRegister from './pages/partner/register/RestaurantRegister';
import Register from './pages/Register/Register';
import SuperAdminLayout from './SuperAdmin/SuperAdminLayout';
import SuperAdminLoginRegister from './SuperAdmin/pages/SuperAdminLogin/SuperAdminAuth';
import AdminLoginRegister from './Admin/pages/AdminLogin/Adminlogin';
import RadminPage from './Admin/pages/Radmin/RadminPage';
import RestaurantDetail from './pages/RestaurantDetail/RestaurantDetail';
import { CartProvider } from './context/CartContext';
import CartPage from './pages/CartPage/CartPage';
import PaymentPage from './pages/Payment/Payment'; 
import OfferList from './pages/offer/OfferList.js';
import OrderHistory from './pages/OrderHistory/OrderHistory.js';
import TrackingPage from './pages/TrackingPage/TrackingPage.js';
import FoodDeliveredAlert from './pages/TrackingPage/FoodDeliveredAlert.js';
import InvoicePage from './invoice/InvoicePage.js';
import SearchBar from './components/HeaderItems/SearchBar.js';

const AppWrapper = () => {
  const location = useLocation();
  const [userLocation, setUserLocation] = useState({
    lat: null,
    lng: null,
    area: '',
    city: '',
    state: '',
  });

  const isAdminPath = location.pathname.startsWith('/admin');
  const isSuperAdminPath = location.pathname.startsWith('/super-admin');

  return (
    <div className="App">
      {/* Show Header only for main app pages, not for admin/super-admin */}
      {!isAdminPath && !isSuperAdminPath && (
        <Header setUserLocation={setUserLocation} />
      )}

      <Routes>
        {/* ===== MAIN APPLICATION ROUTES ===== */}
        <Route path="/" element={<Home />} />
        <Route path="/menu" element={<Menu userLocation={userLocation} />} />
        <Route path="/help" element={<Help />} />
        <Route path="/login" element={<LoginRegister />} />
        <Route path="/register" element={<Register />} />
        <Route path="/loginregister" element={<LoginRegister />} />
        <Route path="/buy" element={<Buy />} />
        <Route path="/partnership" element={<PartnerUi />} />
        <Route path="/restaurantregister" element={<RestaurantRegister />} />
        <Route path="/restaurant/:restaurantId" element={<RestaurantDetail />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/payment" element={<PaymentPage />} />
        <Route path="/OfferList" element={<OfferList />} />
        <Route path="/OrderHistory" element={<OrderHistory />} />
        <Route path="/tracking/:orderId" element={<TrackingPage />} />
        <Route path="/InvoicePage" element={<InvoicePage />} />
        <Route path="/FoodDeliveredAlert" element={<FoodDeliveredAlert />} />
        <Route path="/search" element={<SearchBar  userLocation={userLocation}/>} />


        {/* ===== ADMIN ROUTES ===== */}
        <Route path="/admin/login" element={<AdminLoginRegister />} />
        <Route path="/adminauth" element={<AdminLoginRegister />} />
        <Route path="/admin" element={<Navigate to="/admin/overview" replace />} />
        <Route path="/admin/:section" element={<RadminPage />} />
        
        {/* ===== SUPER ADMIN ROUTES ===== */}
        <Route path="/super-admin/login" element={<SuperAdminLoginRegister />} />
        <Route path="/superadminlogin" element={<SuperAdminLoginRegister />} />
        <Route path="/super-admin" element={<Navigate to="/super-admin/dashboard" replace />} />
        <Route path="/super-admin/*" element={<SuperAdminLayout />} />
      </Routes>

      {/* Show Footer only for main app pages, not for admin/super-admin */}
      {!isAdminPath && !isSuperAdminPath && <Footer />}
    </div>
  );
};

function App() {
  return (
    <Router>
      <CartProvider>
        <AppWrapper />
      </CartProvider>
    </Router>
  );
}

export default App;


