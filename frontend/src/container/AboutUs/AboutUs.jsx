import React from 'react';
import { images } from '../../constants';

const AboutUs = () => (
  <div
    className="relative z-0 bg-[#fff5f7] text-[#ff4d4d] px-8 py-16 overflow-hidden"
    id="about"
  >
    {/* Overlay (Knife Background) */}
    <div className="pointer-events-none absolute inset-0 top-20 flex justify-center items-center z-0">
      <img
        src={images.Z}
        alt="overlay_logo"
        className="w-[200px] h-auto "
      />
    </div>

    {/* Content Wrapper */}
    <div className="relative z-10 flex flex-col lg:flex-row lg:justify-between lg:items-start gap-12">
      {/* Left Section */}
      <div className="flex-1 flex flex-col text-center gap-5">
        <h1 className="text-center font-serif text-3xl text-[#ff4d4d] font-bold">About Us</h1>
        <img src={images.spoon} alt="about_spoon" className="w-[45px] mx-auto" />
        <p className="text-[#4f4f4f] text-base leading-7 font-sans font-normal">
          We’re not just another food delivery app—we’re your everyday hunger companion. Whether you’re craving a quick snack, a full course dinner, or something new to explore, we’ve got you covered.
        </p>
        <p className="text-[#4f4f4f] text-base leading-7 font-sans font-normal">
          Our mission is to connect people with food they love, from the comfort of their homes. Whether you're planning a family dinner, a midnight snack, or a weekend feast, we ensure every dish arrives fresh, hot, and just the way you want it.
        </p>
        <button className="bg-orange-500 text-white font-bold font-sans text-base px-8 py-3 mt-4 mx-auto hover:bg-orange-600 transition">
          Know More
        </button>
      </div>

      {/* Knife Image Center */}
      <div className="flex justify-center items-center my-8 lg:my-0 z-10">
        <img
          src={images.knife}
          alt="knife_center"
          className="h-[250px] rotate-90 lg:rotate-0 lg:h-[450px]"
        />
      </div>

      {/* Right Section */}
      <div className="flex-1 flex flex-col text-center gap-5">
        <h1 className="text-center font-serif text-3xl text-[#ff4d4d] font-bold">From Us to Your Plate</h1>
        <img src={images.spoon} alt="about_spoon" className="w-[45px] mx-auto" />
        <p className="text-[#4f4f4f] text-base leading-7 font-sans font-normal">
          Every meal we deliver is more than just food—it’s a promise. From sourcing quality ingredients to trusted kitchens, we ensure each order meets high standards and reaches you hot and fresh.
        </p>
        <p className="text-[#4f4f4f] text-base leading-7 font-sans font-normal">
          Whether it’s breakfast before work or late-night biryani, we bring your favorite meals to your doorstep with care, speed, and satisfaction. Great food should always be within reach — no matter where you are, we’ll get it to you.
        </p>
        <button className="bg-orange-500 text-white font-bold font-sans text-base px-8 py-3 mt-4 mx-auto hover:bg-orange-600 transition">
          Explore Our Journey
        </button>
      </div>
    </div>
  </div>
);

export default AboutUs;
