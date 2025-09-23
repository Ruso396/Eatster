import React from 'react';
import { BsInstagram, BsArrowLeftShort, BsArrowRightShort } from 'react-icons/bs';
import { SubHeading } from '../../components';
import { images } from '../../constants';
import '../../pages/global.css'

const Gallery = () => {
  const scrollRef = React.useRef(null);

  const scroll = (direction) => {
    const { current } = scrollRef;
    if (direction === 'left') current.scrollLeft -= 300;
    else current.scrollLeft += 300;
  };

  return (
    <div className="relative flex flex-wrap md:flex-nowrap justify-center items-center px-4 md:px-8 py-16 bg-black text-white">
      {/* Left Content */}
      <div className="flex-1 min-w-[300px] mb-8 md:mb-0 md:mr-8">
        <SubHeading title="Restaurants " />
        <h1 className="text-4xl font-bold mt-4 mb-4">Nearby Restaurants </h1>
       <p className="text-[#aaa] text-base leading-relaxed max-w-[400px] mb-6">
  Explore the finest restaurants near you — handpicked for their mouthwatering menus, cozy ambiance, and top-notch service. Your next favorite meal is just around the corner!
</p>

        <button
          type="button"
          className="bg-[#DCCA87] text-[#0c0c0c] font-bold font-sans text-base px-8 py-3 mt-4 mx-auto hover:bg-[#bfa04f] transition"
        >
          View More
        </button>
      </div>

      {/* Right Image Gallery */}
      <div className="relative flex flex-col flex-1 min-w-[300px]">
        <div
          className="flex overflow-x-scroll scroll-smooth no-scrollbar"
          ref={scrollRef}
        >
          {[images.gallery01, images.gallery02, images.gallery03, images.gallery04].map((image, index) => (
            <div
              className="relative min-w-[200px] h-[220px] mr-4 overflow-hidden rounded-lg group md:min-w-[200px] md:h-[220px] sm:min-w-[150px] sm:h-[170px]"
              key={`gallery_image-${index + 1}`}
            >
              <img
                src={image}
                alt="gallery_img"
                className="w-full h-full object-cover rounded-lg transform transition-transform duration-300 group-hover:scale-105"
              />
              <BsInstagram className="absolute top-1/2 left-1/2 text-white text-xl md:text-2xl transform -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
          ))}
        </div>

        {/* Arrows */}
        <div className="absolute -bottom-10 right-4 flex gap-4 md:right-4 sm:static sm:justify-center sm:mt-4">
          <BsArrowLeftShort
            onClick={() => scroll('left')}
            className="bg-[#DCCA87] text-black text-2xl md:text-3xl rounded-full p-2 cursor-pointer hover:bg-[#c5b76d] transition-colors"
          />
          <BsArrowRightShort
            onClick={() => scroll('right')}
            className="bg-[#DCCA87] text-black text-2xl md:text-3xl rounded-full p-2 cursor-pointer hover:bg-[#c5b76d] transition-colors"
          />
        </div>
      </div>
    </div>
  );
};

export default Gallery;
