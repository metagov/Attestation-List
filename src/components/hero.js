import React from 'react';
import { Link } from 'react-router-dom';

export default function Header() {
  return (
    <section className=" flex flex-col gap-2.5 mt-24  top-40 h-fit">
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
        href="https://docs.daostar.org/DAOIP/7"
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
    </section>
  )
}
