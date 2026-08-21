import React from 'react';
import HeroSection from '../components/HeroSection';
import FeatureGrid from '../components/FeatureGrid';
import PlanCarousel from '../components/PlanCarousel';

const Home = () => {
  return (
    <main>
      <HeroSection />
      <FeatureGrid />
      <PlanCarousel />
    </main>
  );
};

export default Home;
