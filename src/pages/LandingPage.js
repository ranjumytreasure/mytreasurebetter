
import React, { useEffect } from 'react';
import { FeaturedProducts, Hero, Services, Contact } from '../components'
import ReactGA from 'react-ga4';
import { TRACKING_ID } from '../utils/constants'

// Initialize ReactGA with your tracking ID
ReactGA.initialize(TRACKING_ID);

const LandingPage = () => {
  // Use useEffect to track page view on component mount
  useEffect(() => {
    // Send the initial pageview here
    ReactGA.send({ hitType: 'pageview', page: window.location.pathname });
  }, []);

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <Hero />

      {/* How It Works Section */}
      <FeaturedProducts />

      {/* Services Section */}
      <Services />

      {/* Newsletter Section */}
      <Contact />
    </div>
  );
}

export default LandingPage;
