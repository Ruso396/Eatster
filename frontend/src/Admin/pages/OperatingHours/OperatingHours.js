import React from 'react';
import { CalendarDays } from 'lucide-react';

const OperatingHours = ({ restaurantStatus, toggleRestaurantStatus }) => {
  return (
    <section className="bg-white p-6 rounded-xl shadow-md">
      <h3 className="text-xl font-semibold text-gray-800 mb-4">Operating Hours Control</h3>
      <div className="flex items-center mb-6">
        <span className="text-gray-700 mr-4">Restaurant Status:</span>
        <label htmlFor="statusToggle" className="flex items-center cursor-pointer">
          <div className="relative">
            <input
              type="checkbox"
              id="statusToggle"
              className="sr-only"
              checked={restaurantStatus === 'Open'}
              onChange={toggleRestaurantStatus}
            />
            <div className="block bg-gray-300 w-14 h-8 rounded-full"></div>
            <div className={`dot absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition ${
              restaurantStatus === 'Open' ? 'translate-x-full bg-green-500' : 'bg-red-500'
            }`}></div>
          </div>
          <div className="ml-3 text-gray-700 font-medium">{restaurantStatus}</div>
        </label>
      </div>

      <h4 className="text-lg font-medium text-gray-700 mb-3">Set Daily Time Slots</h4>
      <div className="space-y-4">
        {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((day) => (
          <div key={day} className="flex items-center space-x-4 bg-gray-50 p-4 rounded-lg shadow-sm">
            <CalendarDays className="w-5 h-5 text-gray-600" />
            <span className="font-medium text-gray-800 w-24">{day}:</span>
            <input type="time" defaultValue="09:00" className="border border-gray-300 p-2 rounded-md w-28 focus:ring-orange-500 focus:border-orange-500" />
            <span>-</span>
            <input type="time" defaultValue="22:00" className="border border-gray-300 p-2 rounded-md w-28 focus:ring-orange-500 focus:border-orange-500" />
            <button className="bg-blue-500 text-white px-3 py-1 rounded-md text-sm hover:bg-blue-600">Save</button>
          </div>
        ))}
      </div>
    </section>
  );
};

export default OperatingHours;