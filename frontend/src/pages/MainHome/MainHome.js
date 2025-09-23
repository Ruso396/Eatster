import React from 'react';
import Lottie from 'lottie-react';
import { useNavigate } from 'react-router-dom';

import mobileLottie from '../../assets/mobile.json';
import burgerLottie from './delivery.json';
import momoLottie from './burger.json';
import pizzaLottie from './pizza.json';
import partner from './partner.json';

import medal from './medal.png';
import location from './location.png';
import tick from './tick.png';
import ordernow from './ordernow.gif';

import healthy from './healthy.png';
import vegMode from './veg-mode.png';
import gourmet from './gourmet.png';
import offers from './offers.png';
import expressDelivery from './express-delivery.png';
import nearbySpecials from './nearby-specials.png';
import liveTracking from './live-tracking.png';
import smartSuggestions from './smart-suggestions.png';

const MainHome = () => {
  const navigate = useNavigate();

  return (
    <div className="font-sans text-[#333] leading-relaxed">
      {/* Hero Section */}
      <section className="relative bg-[#fff5f7] pt-16 sm:pt-32 pb-10 px-4 text-center overflow-hidden">
        {/* Left Lottie */}
        <div className="absolute top-4 left-2 z-[1] animate-float hidden sm:block">
          <Lottie animationData={burgerLottie} loop style={{ width: 200, height: 300 }} />
        </div>

        {/* Hero Content */}
        <div className="relative z-[2] max-w-xl mx-auto">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#ff4d4d] mb-5 leading-tight">
            Taste the difference with Every bite
          </h1>
          <p className="text-base sm:text-lg text-[#4a4a4a] mb-8 px-1 sm:px-0">
            For over a decade, we’ve enabled our customers to discover new tastes, delivered right to their doorstep
          </p>

          {/* Stats */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 bg-white px-6 py-5 rounded-2xl shadow-lg font-medium mt-6 text-sm sm:text-base">
            <div className="flex items-center gap-3">
              <img src={medal} alt="restaurants" className="h-[40px] sm:h-[50px]" />
              <div>
                <strong className="text-[18px] sm:text-[22px] text-[#2e2e2e]">3,00,000+</strong>
                <br />restaurants
              </div>
            </div>
            <div className="flex items-center gap-3">
              <img src={location} alt="cities" className="h-[40px] sm:h-[50px]" />
              <div>
                <strong className="text-[18px] sm:text-[22px] text-[#2e2e2e]">800+</strong>
                <br />cities
              </div>
            </div>
            <div className="flex items-center gap-3">
              <img src={tick} alt="orders" className="h-[40px] sm:h-[50px]" />
              <div>
                <strong className="text-[18px] sm:text-[22px] text-[#2e2e2e]">3 billion+</strong>
                <br />orders delivered
              </div>
            </div>
          </div>

          {/* Register Button - move here, inside hero section, no extra white bg */}
          <div className="flex justify-center mt-10">
            <button
              onClick={() => navigate('/restaurantregister')}
              className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 px-6 rounded shadow transition"
            >
              Register Your Restaurant
            </button>
          </div>
        </div>

        {/* Right Lotties */}
        <div className="absolute top-[30px] right-[40px] z-[1] animate-float hidden sm:block">
          <Lottie animationData={momoLottie} loop style={{ width: 200, height: 280 }} />
        </div>
        <div className="absolute top-[150px] right-[10px] z-[1] animate-float hidden sm:block">
          <Lottie animationData={pizzaLottie} loop style={{ width: 140, height: 280 }} />
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-[#fff5f7] py-10 sm:py-20 px-4 text-center">
        <h2 className="text-2xl sm:text-3xl md:text-4xl text-[#ff4d4d] font-extrabold mb-4">
          What’s waiting for you on the app?
        </h2>
        <p className="text-base sm:text-lg text-[#4f4f4f] mb-8">
          Our app is packed with features that enable you to experience food delivery like never before
        </p>

        <div className="flex flex-col lg:flex-row justify-center items-center gap-8">
          {/* Left Features */}
          <div className="grid grid-cols-2 gap-4">
            {[healthy, vegMode, gourmet, offers].map((img, idx) => (
              <div
                key={idx}
                className="bg-white rounded-xl p-3 shadow-md hover:scale-105 transition w-[100px] sm:w-[120px] text-center"
              >
                <img src={img} alt="feature" className="w-12 h-12 sm:w-16 sm:h-16 mb-1 mx-auto" />
                <p className="text-xs sm:text-sm font-medium">
                  {img.split('/').pop().split('.')[0]}
                </p>
              </div>
            ))}
          </div>

          {/* Center Mobile Preview */}
          <div className="mx-4 w-full sm:w-auto">
            <Lottie animationData={mobileLottie} loop style={{ width: 260, height: 380 }} />
          </div>

          {/* Right Features */}
          <div className="grid grid-cols-2 gap-4">
            {[expressDelivery, nearbySpecials, liveTracking, smartSuggestions].map((img, idx) => (
              <div
                key={idx}
                className="bg-white rounded-xl p-3 shadow-md hover:scale-105 transition w-[100px] sm:w-[120px] text-center"
              >
                <img src={img} alt="feature" className="w-12 h-12 sm:w-16 sm:h-16 mb-1 mx-auto" />
                <p className="text-xs sm:text-sm font-medium">
                  {img.split('/').pop().split('.')[0].replace(/[-_]/g, ' ')}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default MainHome;
