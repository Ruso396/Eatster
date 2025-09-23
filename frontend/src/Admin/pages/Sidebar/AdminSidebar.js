
import React from 'react';
import {
  Home, Utensils, ClipboardList, BarChart,
  Clock, Star, Settings, Tag, FileText, CreditCard
} from 'lucide-react';
import Swal from 'sweetalert2';
import { LogOut } from 'lucide-react';

const NavItem = ({ icon: Icon, label, section, currentPath, navigate }) => (
  <li
    className={`flex items-center p-3 rounded-md cursor-pointer transition-all duration-200 ${
      currentPath === section
        ? 'bg-white text-orange-600 font-semibold shadow-sm'
        : 'text-white hover:bg-white/20'
    }`}
    onClick={() => navigate(`/admin/${section}`)}
  >
    <Icon className="w-5 h-5 mr-3" />
    <span>{label}</span>
  </li>
);

const AdminSidebar = ({ currentPath, navigate, restaurant }) => {
  const handleLogoutClick = () => {
    Swal.fire({
      title: 'Are you sure?',
      text: "You will be logged out from the admin panel.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, Logout'
    }).then((result) => {
      if (result.isConfirmed) {
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        localStorage.removeItem('adminname');
        localStorage.removeItem('email');
        localStorage.removeItem('restaurant_id');

        Swal.fire({
          title: 'Logged out!',
          text: 'You have been successfully logged out.',
          icon: 'success',
          showConfirmButton: false,
          timer: 1500
        });

        navigate('/adminauth');
      }
    });
  };
  return (
    <aside className="w-64 min-h-screen bg-gradient-to-b from-orange-500 via-pink-500 to-purple-600 p-6 flex flex-col">
      <div className="flex items-center mb-6">
        <img
          src={restaurant.logo}
          alt="Restaurant Logo"
          className="w-12 h-12 rounded-full mr-3 border-2 border-white shadow-md"
        />
        <div>
          <h1 className="text-lg font-bold text-white">{restaurant.name}</h1>
          <p className="text-sm text-orange-100">Owner: {restaurant.owner}</p>
          <p className="text-sm text-orange-100">{restaurant.email}</p>
        </div>
      </div>

     <nav>
        <ul className="space-y-2">
          <NavItem icon={Home} label="Dashboard Overview" section="overview" currentPath={currentPath} navigate={navigate} />
          <NavItem icon={ClipboardList} label="Live Orders" section="orders" currentPath={currentPath} navigate={navigate} />
          <NavItem icon={Utensils} label="Menu Management" section="menu" currentPath={currentPath} navigate={navigate} />
          <NavItem icon={BarChart} label="Sales Analytics" section="analytics" currentPath={currentPath} navigate={navigate} />
          <NavItem icon={FileText} label="Invoice" section="invoice" currentPath={currentPath} navigate={navigate} />
          <NavItem icon={Star} label="Reviews & Feedback" section="reviews" currentPath={currentPath} navigate={navigate} />
          <NavItem icon={Tag} label="Offers" section="AdminOffers" currentPath={currentPath} navigate={navigate} />
          <NavItem icon={CreditCard} label="Payment" section="payment" currentPath={currentPath} navigate={navigate} />
          <NavItem icon={Settings} label="Settings" section="settings" currentPath={currentPath} navigate={navigate} />

          {/* 🔁 Logout with confirmation */}
          <li
  className="flex items-center p-3 rounded-md cursor-pointer transition-all duration-200 text-white hover:bg-white/20"
  onClick={handleLogoutClick}
>
  <LogOut className="w-5 h-5 mr-3" />
  <span>Logout</span>
</li>

        </ul>
      </nav>
    </aside>
  );
};

export default AdminSidebar;


