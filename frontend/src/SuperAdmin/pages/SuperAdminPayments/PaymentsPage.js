import React, { useState, useEffect, useRef } from 'react';
import { FaSearch, FaDownload } from 'react-icons/fa';

const PaymentsPage = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRestaurantPayments, setSelectedRestaurantPayments] = useState([]);
  const [selectedRestaurantName, setSelectedRestaurantName] = useState('');
  const paymentTableRef = useRef(null);

  useEffect(() => {
    fetchRestaurants();
  }, []);

  const fetchRestaurants = async () => {
    try {
      const response = await fetch('https://eatster-pro.onrender.com/api/restaurants');
      const data = await response.json();
      setRestaurants(data);
    } catch (error) {
      console.error('Failed to fetch restaurants:', error);
    }
  };

  const fetchPaymentsByRestaurant = async (restaurantId, name) => {
    try {
      const response = await fetch(`https://eatster-pro.onrender.com/api/orders/restaurant/${restaurantId}`);
      const data = await response.json();
      setSelectedRestaurantPayments(data);
      setSelectedRestaurantName(name);

      setTimeout(() => {
        if (paymentTableRef.current) {
          paymentTableRef.current.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    } catch (error) {
      console.error('Failed to fetch payments:', error);
    }
  };

  const filteredRestaurants = restaurants.filter(r =>
    r.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-6 min-h-screen bg-gray-100 font-sans">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Payment Details for Orders</h1>
      </div>

      {/* Controls */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
        <div className="flex items-center bg-white border border-gray-300 rounded-md px-4 py-2 w-full md:max-w-md">
          <FaSearch className="text-gray-500" />
          <input
            type="text"
            placeholder="Search restaurants..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="ml-2 w-full outline-none text-gray-700"
          />
        </div>
        <button className="flex items-center gap-2 bg-purple-700 hover:bg-purple-800 text-white font-semibold px-4 py-2 rounded-md shadow">
          <FaDownload />
          Export
        </button>
      </div>

      {/* Restaurant Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
        {filteredRestaurants.map((restaurant) => (
          <div key={restaurant.id} className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-800">{restaurant.name}</h3>
            <p className="text-sm text-gray-600 mt-1"><strong>Owner:</strong> {restaurant.owner}</p>
            <p className="text-sm text-gray-600"><strong>Email:</strong> {restaurant.email}</p>
            <button
              onClick={() => fetchPaymentsByRestaurant(restaurant.id, restaurant.name)}
              className="mt-4 bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-md font-medium"
            >
              View Payment Details
            </button>
          </div>
        ))}
      </div>

      {/* Payments Table Section */}
      {selectedRestaurantPayments.length > 0 && (
        <div
          className="bg-white p-6 rounded-lg shadow max-w-full overflow-auto"
          ref={paymentTableRef}
        >
          <h2 className="text-xl font-semibold mb-4 text-gray-800">
            Payments for {selectedRestaurantName}
          </h2>
          <table className="w-full border-collapse border text-sm text-center">
            <thead className="bg-gray-100">
              <tr>
                <th className="border px-4 py-2">Order ID</th>
                <th className="border px-4 py-2">Customer ID</th>
                <th className="border px-4 py-2">Delivery Address</th>
                <th className="border px-4 py-2">Payment Method</th>
                <th className="border px-4 py-2">Total (₹)</th>
                <th className="border px-4 py-2">Order Date</th>
                <th className="border px-4 py-2">Delivery Date</th>
              </tr>
            </thead>
            <tbody>
              {selectedRestaurantPayments.map(order => (
                <tr key={order.order_id} className="bg-white hover:bg-gray-50">
                  <td className="border px-4 py-2">{order.order_id}</td>
                  <td className="border px-4 py-2">{order.customer_id}</td>
                  <td className="border px-4 py-2">{order.delivery_address_}</td>
                  <td className="border px-4 py-2">{order.paymentmethod}</td>
                  <td className="border px-4 py-2">₹{order.total_price.toFixed(2)}</td>
                  <td className="border px-4 py-2">{new Date(order.order_date_time).toLocaleString()}</td>
                  <td className="border px-4 py-2">
                    {order.delivery_date_time
                      ? new Date(order.delivery_date_time).toLocaleString()
                      : '-'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default PaymentsPage;








// import React, { useState, useEffect } from 'react';
// import { FaSearch, FaDownload } from 'react-icons/fa';
// import './PaymentsPage.css';

// const PaymentsPage = () => {
//   const [restaurants, setRestaurants] = useState([]);
//   const [searchQuery, setSearchQuery] = useState('');
//   const [selectedRestaurantPayments, setSelectedRestaurantPayments] = useState([]);
//   const [selectedRestaurantName, setSelectedRestaurantName] = useState('');

//   useEffect(() => {
//     fetchRestaurants();
//   }, []);

//   const fetchRestaurants = async () => {
//     try {
//       const response = await fetch('https://eatster-pro.onrender.com/api/restaurants');
//       const data = await response.json();
//       setRestaurants(data);
//     } catch (error) {
//       console.error('Failed to fetch restaurants:', error);
//     }
//   };

//   const fetchPaymentsByRestaurant = async (restaurantId, name) => {
//     try {
//       const response = await fetch(`https://eatster-pro.onrender.com/api/orders/restaurant/${restaurantId}`);
//       const data = await response.json();
//       setSelectedRestaurantPayments(data);
//       setSelectedRestaurantName(name);
//     } catch (error) {
//       console.error('Failed to fetch payments:', error);
//     }
//   };

//   const filteredRestaurants = restaurants.filter(r =>
//     r.name.toLowerCase().includes(searchQuery.toLowerCase())
//   );

//   return (
//     <div className="payments-page">
//       <div className="page-header">
//         <h1>Payment Details for Orders</h1>
//       </div>

//       {/* Search */}
//       <div className="controls">
//         <div className="search-box">
//           <FaSearch />
//           <input
//             type="text"
//             placeholder="Search restaurants..."
//             value={searchQuery}
//             onChange={(e) => setSearchQuery(e.target.value)}
//           />
//         </div>
//         <button className="export-btn">
//           <FaDownload />
//           Export
//         </button>
//       </div>

//       {/* Restaurant Cards */}
//       <div className="restaurant-grid">
//         {filteredRestaurants.map((restaurant) => (
//           <div key={restaurant.id} className="restaurant-card">
//             <h3>{restaurant.name}</h3>
//             <p><strong>Owner:</strong> {restaurant.owner}</p>
//             <p><strong>Email:</strong> {restaurant.email}</p>
//             <button
//               className="view-payments-btn"
//               onClick={() => fetchPaymentsByRestaurant(restaurant.id, restaurant.name)}
//             >
//               View Payment Details
//             </button>
//           </div>
//         ))}
//       </div>

//       {/* Payments Table */}
//       {selectedRestaurantPayments.length > 0 && (
//         <div className="payments-table-section">
//           <h2>Payments for {selectedRestaurantName}</h2>
//           <table className="payments-table">
//             <thead>
//               <tr>
//                 <th>Order ID</th>
//                 <th>Customer ID</th>
//                 <th>Delivery Address</th>
//                 <th>Payment Method</th>
//                 <th>Total (₹)</th>
//                 <th>Order Date</th>
//                 <th>Delivery Date</th>
//               </tr>
//             </thead>
//             <tbody>
//               {selectedRestaurantPayments.map(order => (
//                 <tr key={order.order_id}>
//                   <td>{order.order_id}</td>
//                   <td>{order.customer_id}</td>
//                   <td>{order.delivery_address_}</td>
//                   <td>{order.paymentmethod}</td>
//                   <td>₹{order.total_price.toFixed(2)}</td>
//                   <td>{new Date(order.order_date_time).toLocaleString()}</td>
//                   <td>{order.delivery_date_time ? new Date(order.delivery_date_time).toLocaleString() : '-'}</td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       )}
//     </div>
//   );
// };

// export default PaymentsPage;
