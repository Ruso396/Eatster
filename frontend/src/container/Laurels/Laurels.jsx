import React from 'react';
import { SubHeading } from '../../components';
import { images, data } from '../../constants';

const AwardCard = ({ award: { imgUrl, title, subtitle } }) => (
  <div className="flex items-start justify-start my-4 w-full sm:w-[230px] 2xl:w-[390px]">
    <img src={imgUrl} alt="awards" className="w-[60px] h-auto" />
    <div className="flex flex-col ml-4">
      <p className="text-[#ff4d4d] font-['Cormorant_Garamond'] text-lg font-bold">{title}</p>
      <p className="text-[#4f4f4f] font-['Open_Sans'] text-sm font-normal">{subtitle}</p>
    </div>
  </div>
);

const Laurels = () => (
  <div
    id="awards"
    className="bg-[#fff5f7] flex flex-wrap justify-between items-center px-8 py-16"
  >
    {/* Left Side */}
    <div className="flex-1 min-w-[300px] text-[#ff4d4d]">
      <SubHeading title="Awards & recognition" className="font-bold text-[#ff4d4d]" />
      <h1 className="text-[#ff4d4d] text-4xl font-bold font-['Cormorant_Garamond']">
        Our Journey So Far
      </h1>

      <div className="flex flex-wrap justify-start items-center mt-12 gap-4">
        {data.awards.map((award) => (
          <AwardCard award={award} key={award.title} />
        ))}
      </div>
    </div>

    {/* Right Image */}
    <div className="flex-1 w-full flex justify-center items-center mt-8 lg:mt-0 lg:ml-8">
      <img
        src={images.laurels}
        alt="laurels_img"
        className="w-full px-4 sm:w-3/5 lg:w-4/5 sm:px-0 sm:mt-4 lg:mt-0"
      />
    </div>
  </div>
);

export default Laurels;
