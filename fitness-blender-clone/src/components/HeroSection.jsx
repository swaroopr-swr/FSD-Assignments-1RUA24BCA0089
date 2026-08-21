import React from 'react';

const HeroSection = () => {
  return (
    <section className="w-full bg-[#00b0e5] overflow-hidden font-sans">
      <div className="max-w-[1440px] mx-auto flex flex-col md:flex-row items-center">
        {/* Text Content */}
        <div className="w-full md:w-1/2 px-8 py-16 md:py-24 lg:px-20 text-white flex flex-col justify-center">
          <h1 className="text-6xl md:text-7xl lg:text-[5.5rem] font-bold leading-[1.1] mb-6 tracking-tight" style={{ fontFamily: "'Montserrat', sans-serif" }}>
            Feel Great.<br /> Body and Mind.
          </h1>
          <p className="text-xl md:text-[1.35rem] mb-10 leading-relaxed max-w-xl font-medium text-white">
            Choose from hundreds of workouts, healthy recipes, relaxing meditations, and expert articles, for a whole body and mind approach to feeling great.
          </p>
          <div>
            <a href="/membership" className="inline-block bg-white text-gray-900 font-bold py-[18px] px-[40px] rounded shadow-sm hover:bg-gray-100 transition-colors tracking-wide text-[0.95rem]">
              JOIN NOW
            </a>
          </div>
        </div>

        {/* Image Content */}
        <div className="w-full md:w-1/2 relative h-[400px] md:h-[650px]">
          <img 
            src="https://cloudfront.fitnessblender.com/assets/img/homepage/team-2024-1440.png" 
            alt="Fitness Blender trainer group picture" 
            className="absolute inset-0 w-full h-full object-cover object-center"
          />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
