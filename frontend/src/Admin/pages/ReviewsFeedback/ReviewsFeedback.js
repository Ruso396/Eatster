import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { FaStar, FaUserCircle } from 'react-icons/fa';

const API_BASE_URL = 'http://https://eatster-nine.vercel.app/api';

export default function ReviewsFeedback() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const idToUse = localStorage.getItem('restaurant_id') || '1';
    fetchReviews(idToUse);
  }, []);

  const fetchReviews = async (id) => {
    try {
      const res = await axios.get(`${API_BASE_URL}/orders/reviews/${id}`);
      setReviews(res.data);
    } catch (err) {
      setError('Failed to fetch reviews.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="p-10 max-w-7xl mx-auto">
      <h1 className="text-4xl font-bold mb-8 text-gray-800 flex items-center gap-2">
        ✨ Reviews & Feedback
        <span className="ml-4 px-4 py-1 bg-gradient-to-r from-pink-500 to-orange-400 text-white rounded-full text-sm shadow-md">
          {reviews.length} Total
        </span>
      </h1>

      {loading && <p className="text-gray-500">Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {!loading && !error && reviews.length === 0 && (
        <p className="text-gray-400">No reviews yet.</p>
      )}

      {!loading && !error && reviews.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {reviews.map((review, index) => (
            <motion.div
              key={review.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.05 }}
              className="bg-white/30 backdrop-blur-md border border-white/20 rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300"
            >
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-2 text-purple-700 font-semibold">
                  <FaUserCircle className="w-6 h-6" />
                  <span>{review.customer_id}</span>
                </div>
                <div className="flex items-center">
                  {[...Array(Math.min(review.rating, 5))].map((_, i) => (
                    <FaStar key={i} className="text-yellow-400" />
                  ))}
                  {[...Array(Math.max(0, 5 - review.rating))].map((_, i) => (
                    <FaStar key={i} className="text-gray-300" />
                  ))}
                </div>
              </div>

              <p className="text-gray-700 italic mb-3">
                “{review.comment || 'No comment'}”
              </p>

              <p className="text-xs text-right text-gray-500">
                {new Date(review.created_at).toLocaleString()}
              </p>
            </motion.div>
          ))}
        </div>
      )}
    </section>
  );
}