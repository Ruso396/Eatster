// import React, { useEffect, useState } from 'react';
// import { useNavigate, useParams } from 'react-router-dom';
// import AdminSidebar from '../Sidebar/AdminSidebar';
// import AdminHeader from '../AdminHeader/AdminHeader';
// import DashboardOverview from '../DashboardOverview/DashboardOverview';
// import Settings from '../Settings/Settings';
// import ReviewsFeedback from '../ReviewsFeedback/ReviewsFeedback';
// import OperatingHours from '../OperatingHours/OperatingHours';
// import SalesAnalytics from '../SalesAnalytics/SalesAnalytics';
// import MenuManagement from '../MenuManagement/MenuManagement';
// import LiveOrders from '../LiveOrders/LiveOrders';
// import AdminOffers from '../AdminOffers/AdminOffers';

// const RadminPage = () => {
//   const navigate = useNavigate();
//   const { section } = useParams(); // Get section from URL
//   const [activeSection, setActiveSection] = useState(section || 'overview');

//   useEffect(() => {
//     if (section !== activeSection) {
//       setActiveSection(section || 'overview');
//     }
//   }, [section]);

//   const [restaurant, setRestaurant] = useState({
//     logo: 'https://placehold.co/80x80/000/FFF?text=LOGO',
//     name: 'Little Hearts',
//     owner: 'lakshka',
//     status: 'Open',
//     rating: 4.5,
//     address: '123 Food Street, Culinary City',
//     contact: '+91 98765 43210',
//     email: 'rulux@gmail.com',
//   });

//   const [orders, setOrders] = useState({
//     incoming: [],
//     preparing: [],
//     dispatched: [],
//     completed: [],
//   });

//   const [menuItems, setMenuItems] = useState([]);
//   const [reviews, setReviews] = useState([]);
//   const [salesData, setSalesData] = useState([]);

//   const toggleRestaurantStatus = () => {
//     setRestaurant(prev => ({
//       ...prev,
//       status: prev.status === 'Open' ? 'Closed' : 'Open',
//     }));
//   };

//   const renderSection = () => {
//     switch (activeSection) {
//       case 'overview':
//         return <DashboardOverview restaurant={restaurant} />;
//       case 'orders':
//         return <LiveOrders orders={orders} setOrders={setOrders} />;
//       case 'menu':
//         return <MenuManagement menuItems={menuItems} setMenuItems={setMenuItems} />;
//       case 'analytics':
//         return <SalesAnalytics salesData={salesData} />;
//       case 'hours':
//         return <OperatingHours restaurantStatus={restaurant.status} toggleRestaurantStatus={toggleRestaurantStatus} />;
//       case 'reviews':
//         return <ReviewsFeedback reviews={reviews} />;
//       case 'AdminOffers':
//            return <AdminOffers restaurant={restaurant} setRestaurant={setRestaurant} />;

//       case 'settings':
//         return <Settings restaurant={restaurant} setRestaurant={setRestaurant} />;
//       default:
//         return <DashboardOverview restaurant={restaurant} />;
//     }
//   };

//   return (
//     <div className="flex min-h-screen bg-gray-50 font-inter">
//       <AdminSidebar currentPath={activeSection} navigate={navigate} restaurant={restaurant} />
//       <main className="flex-1 p-8">
//         <AdminHeader activeSection={activeSection} restaurantStatus={restaurant.status} toggleRestaurantStatus={toggleRestaurantStatus} />
//         {renderSection()}
//       </main>
//     </div>
//   );
// };

// export default RadminPage;



import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

import AdminSidebar from '../Sidebar/AdminSidebar';
import AdminHeader from '../AdminHeader/AdminHeader';
import DashboardOverview from '../DashboardOverview/DashboardOverview';
import Settings from '../Settings/Settings';
import ReviewsFeedback from '../ReviewsFeedback/ReviewsFeedback';
import OperatingHours from '../OperatingHours/OperatingHours';
import SalesAnalytics from '../SalesAnalytics/SalesAnalytics';
import MenuManagement from '../MenuManagement/MenuManagement';
import LiveOrders from '../LiveOrders/LiveOrders';
import AdminOffers from '../AdminOffers/AdminOffers';
import AdminPayment from '../AdminPayment/AdminPayment';
import AdminInvoicesPage from '../AdminInvoice/AdminInvoice';

const RadminPage = () => {
  const navigate = useNavigate();
  const { section } = useParams();
  const [activeSection, setActiveSection] = useState(section || 'overview');

  const [restaurant, setRestaurant] = useState({
    logo: '',
    name: '',
    owner: '',
    status: 'Open',
    rating: 0,
    address: '',
    mobile: '',
    email: '',
    fssai: '',
    gstin: '',
    pan: '',
    account_name: '',
    account_number: '',
    ifsc: ''
  });

  const [orders, setOrders] = useState({
    incoming: [],
    preparing: [],
    dispatched: [],
    completed: [],
  });

  const [menuItems, setMenuItems] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [salesData, setSalesData] = useState([]);

  // Fetch admin's restaurant details using email
  useEffect(() => {
    const fetchRestaurantDetails = async () => {
      const userEmail = localStorage.getItem('email');
      if (!userEmail) {
        console.error("No email found in localStorage. Please log in.");
        return;
      }

      try {
        const response = await axios.get(`https://backend-weld-three-46.vercel.app/api/restaurants/details/${userEmail}`);
        const data = response.data;

        setRestaurant({
          logo: data.logo || 'https://placehold.co/80x80/000/FFF?text=LOGO',
          name: data.name || '',
          owner: data.owner || '',
          status: data.status || 'Open',
          rating: data.rating || 0,
          address: data.address || '',
          mobile: data.mobile || '',
          email: data.email || '',
          fssai: data.fssai || '',
          gstin: data.gstin || '',
          pan: data.pan || '',
          account_name: data.account_name || '',
          account_number: data.account_number || '',
          ifsc: data.ifsc || ''
        });
      } catch (error) {
        console.error("Failed to fetch restaurant details:", error);
      }
    };

    fetchRestaurantDetails();
  }, []);

  useEffect(() => {
    if (section !== activeSection) {
      setActiveSection(section || 'overview');
    }
  }, [section]);

  const toggleRestaurantStatus = () => {
    setRestaurant(prev => ({
      ...prev,
      status: prev.status === 'Open' ? 'Closed' : 'Open',
    }));
  };

  const renderSection = () => {
    switch (activeSection) {
      case 'overview':
        return <DashboardOverview restaurant={restaurant} />;
      case 'orders':
        return <LiveOrders orders={orders} setOrders={setOrders} />;
      case 'menu':
        return <MenuManagement menuItems={menuItems} setMenuItems={setMenuItems} />;
      case 'analytics':
        return <SalesAnalytics salesData={salesData} />;
      case 'invoice':
        return <AdminInvoicesPage restaurant={restaurant} setRestaurant={setRestaurant} />;
      case 'reviews':
        return <ReviewsFeedback reviews={reviews} />;
      case 'AdminOffers':
        return <AdminOffers restaurant={restaurant} setRestaurant={setRestaurant} />;
      case 'settings':
        return <Settings restaurant={restaurant} setRestaurant={setRestaurant} />;
      case 'payment':
        return <AdminPayment restaurant={restaurant} setRestaurant={setRestaurant} />;
      default:
        return <DashboardOverview restaurant={restaurant} />;
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50 font-inter">
      <AdminSidebar currentPath={activeSection} navigate={navigate} restaurant={restaurant} />
      <main className="flex-1 p-8">
        <AdminHeader activeSection={activeSection} restaurantStatus={restaurant.status} toggleRestaurantStatus={toggleRestaurantStatus} />
        {renderSection()}
      </main>
    </div>
  );
};

export default RadminPage;
