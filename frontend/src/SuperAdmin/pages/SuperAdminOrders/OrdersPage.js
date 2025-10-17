import React, { useState, useEffect } from 'react';
import { FaSearch, FaFilter, FaDownload } from 'react-icons/fa';

const OrdersPage = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedRestaurantOrders, setSelectedRestaurantOrders] = useState([]);
  const [selectedRestaurantName, setSelectedRestaurantName] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchRestaurants();
  }, []);

  const fetchRestaurants = async () => {
    try {
      const response = await fetch('https://backend-weld-three-46.vercel.app/api/restaurants');
      const data = await response.json();
      setRestaurants(data);
    } catch (error) {
      console.error('Failed to fetch restaurants:', error);
    }
  };

  const fetchOrdersByRestaurant = async (restaurantId, name) => {
    try {
      const response = await fetch(`https://backend-weld-three-46.vercel.app/api/orders/restaurant/${restaurantId}`);
      const data = await response.json();
      setSelectedRestaurantOrders(data);
      setSelectedRestaurantName(name);
      setIsModalOpen(true);
    } catch (error) {
      console.error('Failed to fetch orders:', error);
    }
  };

  const filteredRestaurants = restaurants.filter(r =>
    r.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-6 min-h-screen bg-gray-100">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-500 to-purple-600 text-transparent bg-clip-text">
          Track and Manage All Orders
        </h1>
      </div>

      {/* Controls */}
      <div className="flex flex-wrap gap-4 justify-between items-center mb-8">
        <div className="flex items-center bg-white rounded-lg shadow px-4 py-2 w-full md:w-1/3">
          <FaSearch className="text-gray-500" />
          <input
            type="text"
            placeholder="Search restaurants..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="ml-3 w-full outline-none text-gray-700"
          />
        </div>

        <div className="flex items-center bg-white rounded-lg shadow px-4 py-2 w-full md:w-1/4">
          <FaFilter className="text-gray-500" />
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="ml-3 w-full bg-white outline-none text-gray-700"
          >
            <option value="all">All Status</option>
            <option value="Placed">Placed</option>
            <option value="Preparing">Preparing</option>
            <option value="Out for delivery">Out for Delivery</option>
            <option value="Delivered">Delivered</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>

        <button className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold px-6 py-2 rounded-lg shadow hover:shadow-lg">
          <FaDownload className="inline-block mr-2" />
          Export
        </button>
      </div>

      {/* Restaurant Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredRestaurants.map((restaurant) => (
          <div key={restaurant.id} className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition-all">
            <h3 className="text-lg font-semibold text-gray-800">{restaurant.name}</h3>
            <p className="text-sm text-gray-600"><strong>Owner:</strong> {restaurant.owner}</p>
            <p className="text-sm text-gray-600"><strong>Email:</strong> {restaurant.email}</p>
            <button
              onClick={() => fetchOrdersByRestaurant(restaurant.id, restaurant.name)}
              className="mt-4 bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded-lg font-semibold"
            >
              View Orders
            </button>
          </div>
        ))}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center">
          <div className="relative bg-white w-full max-w-4xl h-[80vh] rounded-lg shadow-lg p-6 ml-0 lg:ml-[280px] flex flex-col">
           

            {/* Sticky header */}
            <div className="sticky top-0 z-10 bg-white pb-4">
              <h2 className="text-2xl font-semibold">
                Orders for {selectedRestaurantName}
              </h2>
              <hr className="mt-2" />
               {/* Close button */}
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-3 right-3 bg-red-600 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold"
            >
              X
            </button>
            </div>

            {/* Scrollable Table */}
            <div className="overflow-y-auto mt-4 flex-1">
              <div className="overflow-x-auto">
                <table className="w-full border border-gray-300 text-sm">
                  <thead className="bg-indigo-100 text-indigo-800">
                    <tr>
                      <th className="py-2 px-4 border">Order ID</th>
                      <th className="py-2 px-4 border">Customer</th>
                      <th className="py-2 px-4 border">Status</th>
                      <th className="py-2 px-4 border">Total</th>
                      <th className="py-2 px-4 border">Ordered At</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedRestaurantOrders
                      .filter(order => filterStatus === 'all' || order.order_status === filterStatus)
                      .map(order => (
                        <tr key={order.order_id} className="hover:bg-gray-50">
                          <td className="py-2 px-4 border">{order.order_id}</td>
                          <td className="py-2 px-4 border">{order.customer_name}</td>
                          <td className="py-2 px-4 border">{order.order_status}</td>
                          <td className="py-2 px-4 border">₹{order.total_price}</td>
                          <td className="py-2 px-4 border">
                            {new Date(order.order_date_time).toLocaleString()}
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrdersPage;
