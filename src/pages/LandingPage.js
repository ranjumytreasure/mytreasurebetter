
import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FeaturedProducts, Hero, Services, Contact, Navbar, Footer } from '../components'
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

  return <div>

    <Hero />
    <FeaturedProducts />

    <Services />
    <Contact />

  </div>


}

export default LandingPage
