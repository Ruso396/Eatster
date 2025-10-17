import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FaUtensils, FaStar, FaMapMarkerAlt } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

const API_BASE_URL = 'http://https://eatster-nine.vercel.app/api';

export default function SuperAdminFeedbackPage({ isDarkMode }) {
  const [restaurants, setRestaurants] = useState([]);
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    axios.get(`${API_BASE_URL}/restaurants`)
      .then(res => setRestaurants(res.data))
      .catch(err => console.error(err));
  }, []);

  const handleRestaurantClick = (restaurant) => {
    setSelectedRestaurant(restaurant);
    const restaurantId = restaurant.id || restaurant.restaurant_id;
    axios.get(`${API_BASE_URL}/orders/reviews/${restaurantId}`)
      .then(res => setReviews(res.data))
      .catch(err => console.error(err));
  };

  return (
    <div className={`min-h-screen p-10 ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-gradient-to-tr from-purple-100 to-blue-200'} font-[Poppins]`}>
      <h1 className="text-4xl font-bold mb-2">🍽️ Reviews & Feedback </h1>
      {/* <p className="mb-10 text-gray-600 dark:text-gray-300">Manage all restaurant reviews with style ✨</p> */}

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Restaurants */}
        <motion.div className="w-full lg:w-1/3 p-4 rounded-3xl shadow-lg bg-gradient-to-br from-purple-200/40 to-blue-200/40 backdrop-blur-xl border border-purple-300/40">
          <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2">
            <FaUtensils /> Restaurants
          </h2>
          {restaurants.length === 0 ? (
            <p>No restaurants found.</p>
          ) : (
            <div className="space-y-5">
              {restaurants.map(r => (
                <motion.div
                  key={r.id || r.restaurant_id}
                  onClick={() => handleRestaurantClick(r)}
                  whileHover={{ y: -4, scale: 1.02 }}
                  className={`cursor-pointer p-5 rounded-2xl transition duration-300 shadow-md bg-white bg-opacity-40 border border-purple-200/50 hover:shadow-xl ${
                    selectedRestaurant && (selectedRestaurant.id || selectedRestaurant.restaurant_id) === (r.id || r.restaurant_id)
                      ? 'ring-2 ring-purple-500'
                      : ''
                  }`}
                >
                  <h3 className="font-semibold text-lg flex items-center gap-2 text-purple-800">
                    <FaUtensils /> {r.name}
                  </h3>
                  <p className="text-sm flex items-center gap-1 text-purple-700">
                    <FaMapMarkerAlt /> {r.address}
                  </p>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>

        {/* Reviews */}
        <motion.div className="flex-1 p-6 rounded-3xl shadow-lg bg-gradient-to-br from-white/50 to-white/20 backdrop-blur-xl border border-purple-200/40 min-h-[300px]">
          {selectedRestaurant ? (
            <>
              <h2 className="text-2xl font-semibold mb-4">
                ⭐ Reviews for: {selectedRestaurant.name}
              </h2>
              <AnimatePresence>
                {reviews.length === 0 ? (
                  <motion.p
                    key="noreviews"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="text-purple-700"
                  >
                    No reviews yet for this restaurant.
                  </motion.p>
                ) : (
                  <div className="space-y-4">
                    {reviews.map((rev, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="p-4 rounded-2xl border border-purple-300/40 bg-white/30 backdrop-blur-lg shadow-md"
                      >
                        <div className="flex items-center gap-2 text-yellow-400 mb-2">
                          <FaStar /> {rev.rating} / 5
                        </div>
                        <p className="text-purple-800">{rev.comment || 'No comment'}</p>
                        <p className="text-xs text-purple-600">
                          Customer ID: {rev.customer_id}
                        </p>
                        <p className="text-xs text-purple-500">
                          {new Date(rev.created_at).toLocaleString()}
                        </p>
                      </motion.div>
                    ))}
                  </div>
                )}
              </AnimatePresence>
            </>
          ) : (
            <p className="text-purple-600">⬅️ Select a restaurant to view reviews</p>
          )}
        </motion.div>
      </div>
    </div>
  );
}