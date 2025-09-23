import React from "react";
import { Link, useLocation } from "react-router-dom";
import { FaCheckCircle, FaUtensils, FaHome } from "react-icons/fa";

const FoodDeliveredAlert = () => {
  const location = useLocation();
  // Get imageUrl from navigation state
  const imageUrl = location.state?.imageUrl;

  // Use the exact same logic as OrderHistory
  let imgSrc = "/food-default.jpg";
  if (imageUrl) {
    imgSrc = imageUrl.startsWith('/uploads/')
      ? `http://localhost:5000${imageUrl}`
      : `http://localhost:5000/uploads/menu_items/${imageUrl}`;
  }

  return (
    <div className="min-h-screen bg-green-50 flex flex-col justify-center items-center px-2 py-6 sm:px-4 sm:py-10 relative overflow-hidden">
      <div className="relative bg-white shadow-2xl rounded-2xl sm:rounded-3xl p-4 sm:p-8 max-w-md w-full text-center z-10">
        <FaCheckCircle className="text-5xl sm:text-6xl text-green-600 mb-3 mx-auto animate-bounce" />
        <h2 className="text-xl sm:text-3xl font-extrabold text-green-700 mb-2 animate-fade-in-down">
          Food Delivered Successfully!
        </h2>
        <p className="text-gray-600 mb-4 sm:mb-6 leading-relaxed text-sm sm:text-base">
          Your delicious meal is here! We hope you enjoy it as much as we enjoyed preparing it.<br />
          Thank you for choosing <span className="font-semibold text-orange-500">Eatster</span>!
        </p>

        <img
          src={imgSrc}
          alt="Food Delivered"
          className="w-40 h-40 sm:w-60 sm:h-60 object-cover mx-auto mb-4 sm:mb-6 rounded-lg shadow-lg hover:scale-105 transition-transform duration-500"
        />

        <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4">
          <Link
            to="/menu"
            className="flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-xl text-sm sm:text-base font-medium transition duration-300 shadow-md hover:shadow-xl"
          >
            <FaUtensils className="text-lg sm:text-xl" /> Order Again
          </Link>
          <Link
            to="/"
            className="flex items-center justify-center gap-2 border border-green-600 hover:bg-green-100 text-green-700 px-4 sm:px-6 py-2 sm:py-3 rounded-xl text-sm sm:text-base font-medium transition duration-300 shadow-sm"
          >
            <FaHome className="text-lg sm:text-xl" /> Go to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default FoodDeliveredAlert;