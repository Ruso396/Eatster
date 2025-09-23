import React from 'react';

const AdminHeader = ({ activeSection, restaurantStatus, toggleRestaurantStatus }) => {
  const title = activeSection
    ? activeSection.charAt(0).toUpperCase() + activeSection.slice(1)
    : 'Dashboard';

  return (
    <div className="flex justify-between items-center mb-6">
      <h1 className="text-2xl font-semibold text-gray-800">{title}</h1>

      <div className="flex items-center space-x-4">
        <span
          className={`px-3 py-1 rounded-full text-sm font-medium ${
            restaurantStatus === 'Open' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          }`}
        >
          {restaurantStatus}
        </span>
        <button
          onClick={toggleRestaurantStatus}
          className="bg-gray-800 text-white px-4 py-2 rounded hover:bg-gray-700 transition"
        >
          {restaurantStatus === 'Open' ? 'Close Now' : 'Open Now'}
        </button>
      </div>
    </div>
  );
};

export default AdminHeader;
