import React from 'react';
import Card from './card';  // Assuming this Card can be adapted for displaying attestation issuer details

export default function Info({ attestation }) {
  return (
    <section className="flex flex-col gap-4 max-w-4xl mx-auto p-6 my-8 sm:p-8 sm:my-10 lg:sticky lg:top-12 rounded-lg">
      <Card data={attestation} />
      <div className="flex flex-col gap-2">
        <div className="text-gray-900 font-semibold">
          <span className="block text-sm sm:text-base font-medium text-indigo-600">API Docs URL</span>
          <a href={attestation.apiDocsURI} target="_blank" rel="noopener noreferrer" className="font-light text-gray-800 hover:text-indigo-700 transition-colors duration-300">
            {attestation.apiDocsURI}
          </a>
        </div>
        <div>
          <span className="block text-sm sm:text-base font-medium text-indigo-600">Issuer Name</span>
          <p className="text-gray-800">{attestation.issuerName}</p>
        </div>
        <div>
          <span className="block text-sm sm:text-base font-medium text-indigo-600">Issuer Description</span>
          <p className="text-gray-800">{attestation.issuerDescription}</p>
        </div>
        <div className="mt-4 text-xs sm:text-sm text-indigo-300 italic">
            Note: Currently, only Optimism network is supported.
        </div>
      </div>
    </section>
  );
}
