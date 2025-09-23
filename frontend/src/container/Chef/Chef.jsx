import React, { useEffect, useRef, useState } from 'react';
import { SubHeading } from '../../components';
import { images } from '../../constants';
import Lottie from 'lottie-react';
import chefAnimation from '../../assets/chef.json';

const Chef = () => {
  const imgRef = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );

    if (imgRef.current) observer.observe(imgRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div className="bg-[#fff5f7] text-[#ff4d4d] flex flex-col md:flex-row justify-center items-center gap-10 px-4 py-14 md:py-20">
      
      {/* Chef Lottie Image */}
      <div
        ref={imgRef}
        className={`w-full md:w-1/2 flex justify-center items-center overflow-hidden transition-all duration-700 ease-out transform ${
          visible ? 'translate-x-0 opacity-100' : '-translate-x-24 opacity-0'
        }`}
      >
        <Lottie
          animationData={chefAnimation}
          loop
          autoplay
          style={{ width: '100%', maxWidth: '400px', height: 'auto' }}
        />
      </div>

      {/* Text Section */}
      <div className="w-full md:w-1/2 flex flex-col items-start mt-8 md:mt-0 px-2 sm:px-4">
        <SubHeading title="Building Trust, One Order at a Time" className="font-bold text-[#ff4d4d]" />
        <h1 className="font-cormorant text-3xl sm:text-4xl mt-4 text-[#ff4d4d] font-bold">
          Your Trusted Food Partner
        </h1>

        <div className="flex flex-col w-full mt-6">
          <div className="flex items-start mb-4">
            <img
              src={images.quote}
              alt="quote"
              className="w-[30px] h-[30px] sm:w-[40px] sm:h-[35px] mr-3 sm:mr-4 mt-1"
            />
            <p className="font-opensans text-sm sm:text-base text-[#4f4f4f] leading-relaxed font-normal">
              95% of our customers say they trust us to deliver quality food, every time.
            </p>
          </div>

          <p className="font-opensans text-sm sm:text-base text-[#4f4f4f] leading-relaxed mb-4 font-normal">
            At Eatster, trust isn’t just a promise — it’s a standard. From real-time order
            tracking to verified partner restaurants and hygienic packaging, we ensure every
            bite you take is safe, delicious, and delivered with care. Our commitment to
            transparency, reliability, and service is what keeps thousands of food lovers
            coming back every day.
          </p>
        </div>

        {/* Signature Section */}
        <div className="w-full mt-6">
          <p className="text-2xl sm:text-[28px] font-cormorant font-normal text-[#ff4d4d] tracking-[1.5px] capitalize font-bold">
            The Eatster Team
          </p>
          <p className="font-opensans text-sm sm:text-base text-[#4f4f4f] mt-2 font-normal">
            Trusted by millions. Driven by quality.
          </p>
          <img
            src={images.sign}
            alt="signature"
            className="w-[70%] sm:w-[120px] mt-8 ml-4 sm:ml-8"
          />
        </div>
      </div>
    </div>
  );
};

export default Chef;
