import React from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';


export default function Header() {
  const navigate = useNavigate();

  return (
    <section className=" flex flex-col gap-2.5 mt-24 top-40 h-fit">
      <span className="mb-4">
        A{' '}
        <a href="https://daostar.org/" className="font-semibold text-black">
          DAOstar
        </a>{' '}
        Project
      </span>

      <p className="text-left max-w-[450px] text-4xl leading-[125%] tracking-[0.002em] text-indigo-800 m-0 font-bold">
        An Attestation standard for DAOs
      </p>

      <p className="text-left max-w-xs text-xl leading-[150%] description" id="why-lists">
        Attestation List is a community-led initiative to improve discoverability, reputation and trust of DAO-related attestations
        in a manner that is inclusive, transparent, and decentralized.
      </p>
      
      <a
        className="transition-all text-indigo-600 ease-in-out duration-300 mt-2 w-fit hover:shadow-indigo-200 hover:-translate-y-1"
        target="_blank"
        rel="noopener noreferrer"
        href="https://github.com/metagov/daostar/discussions/230"
      >
        {'->'} Why Attestation List?
      </a>
      
      <Link
        target="_blank"
        rel="noopener noreferrer"
        to="/attest"
        className="transition-all text-indigo-600 ease-in-out duration-300 mt-2 w-fit hover:shadow-indigo-200 hover:-translate-y-1"
      >
        {'->'} Add your schema
      </Link>
      
      <a
        className="transition-all text-indigo-600 ease-in-out duration-300 mt-2 w-fit hover:shadow-indigo-600 hover:-translate-y-1"
        target="_blank"
        rel="noopener noreferrer"
        href="https://discord.com/invite/PdrPkEZVFk"
      >
        {'->'} Community
      </a>
          <button
            onClick={() => navigate('/explore')}
            className="bg-indigo-600 w-md text-white mt-4 px-4 py-2 rounded-md"
          >
            Explore
          </button>


          <div className="mt-8">
        <h2 className="text-left text-xl font-bold text-indigo-800">Supported By</h2>
        <div className="flex flex-wrap gap-4 mt-4">
          <a href="https://example1.com" className="transition-all text-indigo-600 ease-in-out duration-300 hover:shadow-indigo-200 hover:-translate-y-1">
            <img src="https://cryptologos.cc/logos/optimism-ethereum-op-logo.png?v=032" alt="Supporter 1" className="h-12"/>
          </a>
          <a href="https://example2.com" className="transition-all text-indigo-600 ease-in-out duration-300 hover:shadow-indigo-200 hover:-translate-y-1">
            <img src="https://attest.org/logo2.png?v=3" alt="Supporter 2" className="h-12"/>
          </a>
          <a href="https://example3.com" className="transition-all text-indigo-600 ease-in-out duration-300 hover:shadow-indigo-200 hover:-translate-y-1">
            <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSt6WSOjzQP8a7mrbMfWECrIHILWMLn-Ue6xg&s" alt="Supporter 3" className="h-12"/>
          </a>
        </div>
      </div>
    </section>
  )
}
