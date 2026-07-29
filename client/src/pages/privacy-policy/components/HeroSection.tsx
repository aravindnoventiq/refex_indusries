import React from 'react';

const HeroSection: React.FC = () => {
  return (
    <div className="relative bg-[#3d3d3d] flex items-end justify-start" style={{ height: '310px' }}>
      <div className="absolute inset-0">
        <div className="swiper-slide-bg w-full h-full bg-cover bg-center" style={{ backgroundImage: 'url(https://refex.co.in/wp-content/uploads/2024/07/banner-bg.jpg)' }}></div>
      </div>
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 pb-8">
        <h1 className="font-bold" style={{ fontSize: '40px', color: '#83e034' }}>PRIVACY POLICY</h1>
      </div>
    </div>
  );
};

export default HeroSection;
