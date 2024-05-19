import React, { useEffect } from 'react';
import Header from '../components/header';
import Hero from '../components/hero';
import AllAttestations from '../components/allCards';
import '../index.css';

function Explore() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
        <div className="app">
            <Header />
            <AllAttestations />
        </div>
  );
}

export default Explore;
