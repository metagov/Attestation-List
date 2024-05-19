import React, { useEffect } from 'react';
import Header from '../components/header';
import Hero from '../components/hero';
import AllLists from '../components/allLists';

import '../index.css';

function Home() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);



  return (
<div className="app hidden-scrollbar">
  <Header />
  <div className="flex flex-col md:flex-row gap-12 p-4 hidden-scrollbar">
    <div className="md:flex-1 md:max-w-[460px]"> 
      <Hero />
    </div>
    <div className="md:flex-1 md:min-w-[460px]  h-full">
      <AllLists />
    </div>
  </div>
</div>

  );
}

export default Home;
