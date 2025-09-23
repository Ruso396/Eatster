import React from 'react';

const MenuItem = ({ title, price, tags }) => (
  <div className="w-full my-4 flex flex-col">
    <div className="flex justify-between items-center">
      {/* Left Title */}
      <div className="flex-1">
        <p className="font-serif text-[#DCCA87] text-[18px]">{title}</p>
      </div>

      {/* Dash Line */}
      <div className="w-[90px] h-[1px] bg-[#DCCA87] mx-4"></div>

      {/* Price */}
      <div className="flex justify-end items-end">
        <p className="font-serif text-[#DCCA87] text-[18px]">{price}</p>
      </div>
    </div>

    {/* Subtitle/Tags */}
    <div className="w-full mt-1">
      <p className="font-sans text-[#AAAAAA] text-[14px]">{tags}</p>
    </div>
  </div>
);

export default MenuItem;
