import React from 'react';
import MainHome from '../pages/MainHome/MainHome';

import {  Header, AboutUs,  Chef, Intro, Laurels  } from '../container';

const Home = () => {
  return (
    <div className="home-page-container">
      <MainHome />
      <Header />
      <Chef />
      <Intro />
      <Laurels />
      <AboutUs />
    </div>
  );
};

export default Home;
