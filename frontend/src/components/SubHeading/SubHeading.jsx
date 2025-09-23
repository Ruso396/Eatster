import React from 'react';

import { images } from '../../constants';

const SubHeading = ({ title, className = '' }) => (
  <div className='mb-4'>
    <p className={`m-0 font-CormorantUpright capitalize leading-7 text-base font-bold tracking-wider ${className}`}>{title}</p>
    <img src={images.spoon} alt="spoon_image" className=" w-12 " />
  </div>
);

export default SubHeading;
