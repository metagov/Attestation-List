import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import logo from '../logo/color.png';

export default function Header({ back }) {
  return (
    <header className="flex w-full justify-between p-4 box-border sticky top-0 backdrop-blur-[20px] z-50 bg-white/5 border-b-[0.75px] border-gray-800/20">
      <Link className="flex items-center" to="/">
        <img src={logo} alt="logo" className="w-8 h-8" />
        <span className="ml-2 text-base sm:text-xl font-semibold text-indigo-800">DAO Attestation List</span> 
      </Link>

      <nav className="inline-flex flex-wrap items-center gap-2 sm:gap-4">
        <a
          className="ml-2 sm:ml-4 hidden sm:inline"
          target="_blank"
          rel="noopener noreferrer"
          href="https://discord.gg/PdrPkEZVFk"
        >
          Community
        </a>
        <a
          className="ml-2 sm:ml-4 hidden sm:inline"
          target="_blank"
          rel="noopener noreferrer"
          href="https://docs.daostar.org/DAOIP/7"
        >
          Why lists?
        </a>
        <NavLink
          className="ml-2 sm:ml-4 hidden sm:inline"
          target="_blank"
          rel="noopener noreferrer"
          to="/attest"
        >
          Add your schema
        </NavLink>

        <a
          className="ml-2 sm:ml-4 inline-flex items-center p-2 bg-indigo-800 rounded-lg text-white transition-shadow ease-in-out duration-300 hover:shadow-[0_-6px_6px_rgba(255,255,255,0.7)] hover:-translate-y-1"
          target="_blank"
          rel="noopener noreferrer"
          href="https://github.com/metagov/Attestation-List"
        >
          <img
            style={{ filter: 'invert(1)' }}
            src="https://raw.githubusercontent.com/feathericons/feather/master/icons/github.svg"
            alt="github icon"
            className="w-4 h-4 mr-2" 
          />
          
          <span className="text-sm sm:text-base">GitHub</span>  
        </a>

        
        <a
          className=" inline-flex items-center p-2 bg-indigo-700 rounded-lg text-white transition-shadow ease-in-out duration-300 hover:shadow-[0_-6px_6px_rgba(255,255,255,0.7)] hover:-translate-y-1"
          target="_blank"
          rel="noopener noreferrer"
          href="https://t.me/daoattestationlist"
          
          <img
            style={{ filter: 'invert(1)' }}
            src="https://raw.githubusercontent.com/feathericons/feather/master/icons/tool.svg"
            alt="tool icon"
            className="w-4 h-4 mr-2" 
          />
          
          <span className="text-sm sm:text-base">Support</span>  
        </a>
      </nav>
    </header>
  );
}
