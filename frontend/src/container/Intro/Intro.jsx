import React from 'react';
import { meal } from '../../constants'; // video file path
 
const Intro = () => {
  return (
    <div className="relative h-screen overflow-hidden bg-[#fff5f7] text-[#ff4d4d]">
      <video
        src={meal}
        type="video/mp4"
        autoPlay
        loop
        muted
        controls={false}
        className="w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-[#fff5f7]/80"></div>
    </div>
  );
};

export default Intro;
