// // import React, { useState, useEffect } from 'react';
// // import {
// //   Utensils, CircleCheck, CircleX, Star,
// //   MapPin, Phone, Mail
// // } from 'lucide-react';
// // import axios from 'axios';

// // const DashboardOverview = () => {
// //   const [restaurant, setRestaurant] = useState(null);
// //   const [loading, setLoading] = useState(true);
// //   const [error, setError] = useState(null);

// //   const BASE_URL = 'http://192.168.18.187:5000';

// //   useEffect(() => {
// //     const fetchRestaurantDetails = async () => {
// //       try {
// //         const adminEmail = localStorage.getItem('email');
// //         const token = localStorage.getItem('token');

// //         if (!adminEmail || !token) {
// //           setError("Login credentials missing. Please log in.");
// //           setLoading(false);
// //           return;
// //         }

// //         const config = {
// //           headers: {
// //             Authorization: `Bearer ${token}`,
// //           },
// //         };

// //         const response = await axios.get(
// //           `${BASE_URL}/api/restaurants/details/${adminEmail}`,
// //           config
// //         );
// //         setRestaurant(response.data);
// //       } catch (err) {
// //         console.error('Error fetching restaurant details:', err);
// //         setError('Unable to load restaurant profile.');
// //       } finally {
// //         setLoading(false);
// //       }
// //     };

// //     fetchRestaurantDetails();
// //   }, []);

// //   if (loading) return <div className="text-center py-10">Loading restaurant details...</div>;
// //   if (error) return <div className="text-center py-10 text-red-600">{error}</div>;
// //   if (!restaurant) return <div className="text-center py-10">No restaurant data found.</div>;

// //   return (
// //     <section className="bg-white p-6 rounded-xl shadow-md">
// //       <h3 className="text-xl font-semibold text-gray-800 mb-4">Restaurant Profile Overview</h3>
// //       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        
// //         <div className="flex items-center bg-gray-50 p-4 rounded-lg shadow-sm">
// //           <Utensils className="w-6 h-6 text-orange-500 mr-3" />
// //           <div>
// //             <p className="text-sm text-gray-600">Restaurant Name</p>
// //             <p className="font-medium text-gray-800">{restaurant.name}</p>
// //           </div>
// //         </div>

// //         <div className="flex items-center bg-gray-50 p-4 rounded-lg shadow-sm">
// //           {restaurant.status === 'accepted' ? (
// //             <CircleCheck className="w-6 h-6 text-green-500 mr-3" />
// //           ) : (
// //             <CircleX className="w-6 h-6 text-red-500 mr-3" />
// //           )}
// //           <div>
// //             <p className="text-sm text-gray-600">Status</p>
// //             <p className={`font-medium ${restaurant.status === 'accepted' ? 'text-green-700' : 'text-red-700'}`}>
// //               {restaurant.status}
// //             </p>
// //           </div>
// //         </div>

// //         <div className="flex items-center bg-gray-50 p-4 rounded-lg shadow-sm">
// //           <Star className="w-6 h-6 text-yellow-500 mr-3" />
// //           <div>
// //             <p className="text-sm text-gray-600">Rating</p>
// //             <p className="font-medium text-gray-800">{restaurant.rating || 'N/A'} / 5</p>
// //           </div>
// //         </div>

// //         <div className="flex items-center bg-gray-50 p-4 rounded-lg shadow-sm">
// //           <MapPin className="w-6 h-6 text-blue-500 mr-3" />
// //           <div>
// //             <p className="text-sm text-gray-600">Address</p>
// //             <p className="font-medium text-gray-800">
// //               {restaurant.address}, {restaurant.city} - {restaurant.pincode}
// //             </p>
// //           </div>
// //         </div>

// //         <div className="flex items-center bg-gray-50 p-4 rounded-lg shadow-sm">
// //           <Phone className="w-6 h-6 text-purple-500 mr-3" />
// //           <div>
// //             <p className="text-sm text-gray-600">Contact Number</p>
// //             <p className="font-medium text-gray-800">{restaurant.mobile}</p>
// //           </div>
// //         </div>

// //         <div className="flex items-center bg-gray-50 p-4 rounded-lg shadow-sm">
// //           <Mail className="w-6 h-6 text-indigo-500 mr-3" />
// //           <div>
// //             <p className="text-sm text-gray-600">Email</p>
// //             <p className="font-medium text-gray-800">{restaurant.email}</p>
// //           </div>
// //         </div>

// //       </div>
// //     </section>
// //   );
// // };

// // export default DashboardOverview;
// import React, { useState, useEffect } from 'react';
// import {
//   Utensils, CircleCheck, CircleX, Star,
//   MapPin, Phone, Mail
// } from 'lucide-react';
// import axios from 'axios';

// const DashboardOverview = () => {
//   const [restaurant, setRestaurant] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   const BASE_URL = 'http://192.168.18.187:5000';

//   useEffect(() => {
//     const fetchRestaurantDetails = async () => {
//       try {
//         const adminEmail = localStorage.getItem('email');
//         const token = localStorage.getItem('token');

//         if (!adminEmail || !token) {
//           setError("Login credentials missing. Please log in.");
//           setLoading(false);
//           return;
//         }

//         const config = {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         };

//         const response = await axios.get(
//           `${BASE_URL}/api/restaurants/details/${adminEmail}`,
//           config
//         );
//         setRestaurant(response.data);
//       } catch (err) {
//         console.error('Error fetching restaurant details:', err);
//         setError('Unable to load restaurant profile.');
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchRestaurantDetails();
//   }, []);

//   if (loading) return <div className="text-center py-10">Loading restaurant details...</div>;
//   if (error) return <div className="text-center py-10 text-red-600">{error}</div>;
//   if (!restaurant) return <div className="text-center py-10">No restaurant data found.</div>;

//   return (
//     <section className="bg-white p-6 rounded-xl shadow-md">
//       <h3 className="text-xl font-semibold text-gray-800 mb-4">Restaurant Profile Overview</h3>
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        
//         {/* Restaurant Name */}
//         <div className="flex items-center bg-gradient-to-r from-pink-500 to-purple-500 text-white p-4 rounded-lg shadow-md hover:scale-[1.02] transition-transform duration-200">
//           <Utensils className="w-6 h-6 text-white mr-3" />
//           <div>
//             <p className="text-sm">Restaurant Name</p>
//             <p className="font-medium">{restaurant.name}</p>
//           </div>
//         </div>

//         {/* Status */}
//         <div className={`flex items-center ${
//           restaurant.status === 'accepted'
//             ? 'bg-gradient-to-r from-green-400 to-teal-500'
//             : 'bg-gradient-to-r from-red-500 to-pink-500'
//         } text-white p-4 rounded-lg shadow-md hover:scale-[1.02] transition-transform duration-200`}>
//           {restaurant.status === 'accepted' ? (
//             <CircleCheck className="w-6 h-6 text-white mr-3" />
//           ) : (
//             <CircleX className="w-6 h-6 text-white mr-3" />
//           )}
//           <div>
//             <p className="text-sm">Status</p>
//             <p className="font-medium capitalize">{restaurant.status}</p>
//           </div>
//         </div>

//         {/* Rating */}
//         <div className="flex items-center bg-gradient-to-r from-yellow-400 to-yellow-600 text-white p-4 rounded-lg shadow-md hover:scale-[1.02] transition-transform duration-200">
//           <Star className="w-6 h-6 text-white mr-3" />
//           <div>
//             <p className="text-sm">Rating</p>
//             <p className="font-medium">{restaurant.rating || 'N/A'} / 5</p>
//           </div>
//         </div>

//         {/* Address */}
//         <div className="flex items-center bg-gradient-to-r from-blue-400 to-indigo-500 text-white p-4 rounded-lg shadow-md hover:scale-[1.02] transition-transform duration-200">
//           <MapPin className="w-6 h-6 text-white mr-3" />
//           <div>
//             <p className="text-sm">Address</p>
//             <p className="font-medium">
//               {restaurant.address}, {restaurant.city} - {restaurant.pincode}
//             </p>
//           </div>
//         </div>

//         {/* Contact */}
//         <div className="flex items-center bg-gradient-to-r from-purple-500 to-pink-500 text-white p-4 rounded-lg shadow-md hover:scale-[1.02] transition-transform duration-200">
//           <Phone className="w-6 h-6 text-white mr-3" />
//           <div>
//             <p className="text-sm">Contact Number</p>
//             <p className="font-medium">{restaurant.mobile}</p>
//           </div>
//         </div>

//         {/* Email */}
//         <div className="flex items-center bg-gradient-to-r from-indigo-400 to-cyan-500 text-white p-4 rounded-lg shadow-md hover:scale-[1.02] transition-transform duration-200">
//           <Mail className="w-6 h-6 text-white mr-3" />
//           <div>
//             <p className="text-sm">Email</p>
//             <p className="font-medium">{restaurant.email}</p>
//           </div>
//         </div>

//       </div>
//     </section>
//   );
// };

// export default DashboardOverview;




import React, { useState, useEffect } from 'react';
import {
  Utensils, CircleCheck, CircleX, Star,
  MapPin, Phone, Mail
} from 'lucide-react';
import axios from 'axios';

const DashboardOverview = () => {
  const [restaurant, setRestaurant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [todayStats, setTodayStats] = useState(null);

  const BASE_URL = 'http://192.168.18.187:5000';

  useEffect(() => {
    const fetchRestaurantDetails = async () => {
      try {
        const adminEmail = localStorage.getItem('email');
        const token = localStorage.getItem('token');

        if (!adminEmail || !token) {
          setError("Login credentials missing. Please log in.");
          setLoading(false);
          return;
        }

        const config = {
          headers: { Authorization: `Bearer ${token}` },
        };

        const response = await axios.get(
          `${BASE_URL}/api/restaurants/details/${adminEmail}`,
          config
        );
        setRestaurant(response.data);
      } catch (err) {
        console.error('Error fetching restaurant details:', err);
        setError('Unable to load restaurant profile.');
      } finally {
        setLoading(false);
      }
    };

    fetchRestaurantDetails();
  }, []);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const restaurant_id = localStorage.getItem("restaurant_id");
        const token = localStorage.getItem("token");

        if (!restaurant_id || !token) return;

        const response = await axios.get(`${BASE_URL}/api/orders/dashboard/today/${restaurant_id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        setTodayStats(response.data);
      } catch (err) {
        console.error("Failed to fetch today stats:", err);
      }
    };

    fetchStats();
  }, []);

  if (loading) return <div className="text-center py-10">Loading restaurant details...</div>;
  if (error) return <div className="text-center py-10 text-red-600">{error}</div>;
  if (!restaurant) return <div className="text-center py-10">No restaurant data found.</div>;

  return (
    <section className="bg-white p-6 rounded-xl shadow-md">

      {/* ➤ Restaurant Info */}
      <h3 className="text-xl font-semibold text-gray-800 mb-4">Restaurant Profile Overview</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Restaurant Name */}
        <div className="flex items-center bg-gradient-to-r from-pink-500 to-purple-500 text-white p-4 rounded-lg shadow-md hover:scale-[1.02] transition-transform duration-200">
          <Utensils className="w-6 h-6 text-white mr-3" />
          <div>
            <p className="text-sm">Restaurant Name</p>
            <p className="font-medium">{restaurant.name}</p>
          </div>
        </div>

        {/* Status */}
        <div className={`flex items-center ${
          restaurant.status === 'accepted'
            ? 'bg-gradient-to-r from-green-400 to-teal-500'
            : 'bg-gradient-to-r from-red-500 to-pink-500'
        } text-white p-4 rounded-lg shadow-md hover:scale-[1.02] transition-transform duration-200`}>
          {restaurant.status === 'accepted' ? (
            <CircleCheck className="w-6 h-6 text-white mr-3" />
          ) : (
            <CircleX className="w-6 h-6 text-white mr-3" />
          )}
          <div>
            <p className="text-sm">Status</p>
            <p className="font-medium capitalize">{restaurant.status}</p>
          </div>
        </div>

        {/* Rating */}
        <div className="flex items-center bg-gradient-to-r from-yellow-400 to-yellow-600 text-white p-4 rounded-lg shadow-md hover:scale-[1.02] transition-transform duration-200">
          <Star className="w-6 h-6 text-white mr-3" />
          <div>
            <p className="text-sm">Rating</p>
            <p className="font-medium">{restaurant.rating || 'N/A'} / 5</p>
          </div>
        </div>

        {/* Address */}
        <div className="flex items-center bg-gradient-to-r from-blue-400 to-indigo-500 text-white p-4 rounded-lg shadow-md hover:scale-[1.02] transition-transform duration-200">
          <MapPin className="w-6 h-6 text-white mr-3" />
          <div>
            <p className="text-sm">Address</p>
            <p className="font-medium">
              {restaurant.address}, {restaurant.city} - {restaurant.pincode}
            </p>
          </div>
        </div>

        {/* Contact */}
        <div className="flex items-center bg-gradient-to-r from-purple-500 to-pink-500 text-white p-4 rounded-lg shadow-md hover:scale-[1.02] transition-transform duration-200">
          <Phone className="w-6 h-6 text-white mr-3" />
          <div>
            <p className="text-sm">Contact Number</p>
            <p className="font-medium">{restaurant.mobile}</p>
          </div>
        </div>

        {/* Email */}
        <div className="flex items-center bg-gradient-to-r from-indigo-400 to-cyan-500 text-white p-4 rounded-lg shadow-md hover:scale-[1.02] transition-transform duration-200">
          <Mail className="w-6 h-6 text-white mr-3" />
          <div>
            <p className="text-sm">Email</p>
            <p className="font-medium">{restaurant.email}</p>
          </div>
        </div>
      </div>

      {/* ➤ Today’s Summary Cards */}
      {todayStats && (
        <>
          <h3 className="text-xl font-semibold text-gray-800 mt-10 mb-4">Today’s Order Summary</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white p-4 rounded-xl shadow-md">
              <p className="text-sm">Total Orders Today</p>
              <h2 className="text-2xl font-bold">{todayStats.totalOrders}</h2>
            </div>
            <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white p-4 rounded-xl shadow-md">
              <p className="text-sm">Sales Today</p>
              <h2 className="text-2xl font-bold">₹{todayStats.totalSales}</h2>
            </div>
            <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white p-4 rounded-xl shadow-md">
              <p className="text-sm">Live Orders</p>
              <h2 className="text-2xl font-bold">{todayStats.liveOrders}</h2>
            </div>
          </div>
        </>
      )}

      {/* ➤ Recent Orders Table */}
      {todayStats?.recentOrders?.length > 0 && (
        <div className="bg-white p-4 mt-8 rounded-xl shadow-md">
          <h3 className="text-lg font-semibold mb-3">Recent Orders Today</h3>
          <table className="w-full table-auto text-sm text-left">
            <thead className="bg-gray-100 text-gray-600 uppercase">
              <tr>
                <th className="px-4 py-2">Order ID</th>
                <th className="px-4 py-2">Status</th>
                <th className="px-4 py-2">Total</th>
                <th className="px-4 py-2">Time</th>
              </tr>
            </thead>
            <tbody>
              {todayStats.recentOrders.map((order) => (
                <tr key={order.order_id} className="border-b">
                  <td className="px-4 py-2">{order.order_id}</td>
                  <td className="px-4 py-2">{order.order_status}</td>
                  <td className="px-4 py-2">₹{order.total_price}</td>
                  <td className="px-4 py-2">
                    {new Date(order.order_date_time).toLocaleTimeString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
};

export default DashboardOverview;
