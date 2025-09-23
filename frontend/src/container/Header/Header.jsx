import React from 'react';
import { SubHeading } from '../../components';
import welcomeGif from '../../assets/delivery.webp';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();
  return (
    <div
      id="home"
      className="bg-[#fff5f7] text-[#ff4d4d] min-h-screen flex flex-col-reverse md:flex-row justify-between items-center px-2 sm:px-4 md:px-8 pt-8 sm:pt-12 pb-10 font-['Cormorant_Upright']"
    >
      {/* Left Content */}
      <div className="flex-1 flex flex-col justify-center items-start w-full mb-4 md:mb-8 md:items-start md:text-left text-center">
<SubHeading
  title="Delicious Meals, Delivered Fast"
  className="font-bold text-[#ff4d4d]"
/>
        {/* On mobile, GIF comes next, then h1 and p. On desktop, h1/p then GIF. */}
        <div className="block md:hidden w-full flex justify-center my-2">
          <img
            src={welcomeGif}
            alt="Delivery Animation"
            className="w-44 h-auto   mx-auto"
          />
        </div>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-3 text-[#ff4d4d]">
          Order Food from Top Restaurants Near You
        </h1>
        <p className="font-['Open_Sans'] text-xs sm:text-sm md:text-base text-[#4f4f4f] mb-4 sm:mb-5 leading-6 sm:leading-7 md:leading-8 max-w-xs sm:max-w-xl mx-auto md:mx-0">
          Craving something tasty? Discover a wide range of cuisines from your favorite local restaurants and cloud kitchens—all in one place. Whether it's a quick bite or a full-course meal, get it delivered hot and fresh, right to your doorstep. Fast delivery, exclusive offers, and seamless experience—all at your fingertips.
        </p>
        <button
          type="button"
          className="bg-orange-500 text-white font-bold py-2 sm:py-3 px-6 sm:px-8 text-xs sm:text-sm md:text-base transition-colors duration-300 hover:bg-orange-600"
          onClick={() => navigate('/menu')}
        >
          Browse Restaurants
        </button>
      </div>

      {/* Right Animation */}
      <div className="hidden md:flex flex-1 justify-center items-center mt-2 md:mt-0">
        <img
          src={welcomeGif}
          alt="Delivery Animation"
          className="w-48 md:w-[300px] lg:w-[400px] h-auto"
        />
      </div>
    </div>
  );
};

export default Home;
