import React, { useState } from 'react';
import Search from './search';
import FilterResults from 'react-filter-search';

const networkDetailsMap = {
  1: { name: "Ethereum", url: "https://easscan.org" },
  10: { name: "Optimism", url: "https://optimism.easscan.org" },
  42161: { name: "Arbitrum One", url: "https://arbitrum.easscan.org" },
  42170: { name: "Arbitrum Nova", url: "https://arbitrum-nova.easscan.org" },
  137: { name: "Polygon", url: "https://polygon.easscan.org" }
};

function mapNetworkIDtoDetails(networkID) {
  return networkDetailsMap[networkID] || { name: "Unknown", url: "#" };
}

const renderNetworkID = (networkID) => {
  let decimalValue = networkID;

  if (networkID && typeof networkID === 'object' && networkID.hex && networkID.type) {
    try {
      decimalValue = parseInt(networkID.hex, 16);
    } catch (error) {
      console.error('Error converting hex to decimal:', error);
      return `${networkID.hex} (conversion error)`;
    }
  }

  const networkDetails = mapNetworkIDtoDetails(decimalValue);
  return networkDetails.name;
};


function TimeSince({ dateString }) {
  const date = new Date(dateString);
  const now = new Date();
  const secondsPast = (now.getTime() - date.getTime()) / 1000;

  let relativeTime = '';

  if (secondsPast < 60) {
    relativeTime = `${Math.round(secondsPast)} seconds ago`;
  } else if (secondsPast < 3600) {
    relativeTime = `${Math.round(secondsPast / 60)} minutes ago`;
  } else if (secondsPast <= 86400) {
    relativeTime = `${Math.round(secondsPast / 3600)} hours ago`;
  } else if (secondsPast > 86400) {
    const days = Math.round(secondsPast / 86400);
    relativeTime = `${days} day${days > 1 ? 's' : ''} ago`;
  }

  const exactDate = date.toLocaleString();

  return (
    <span title={`Time: ${exactDate}`} className="flex-grow text-right whitespace-nowrap">
      {relativeTime}
    </span>
  );
}

function parseSchema(schemaString) {
  const parts = schemaString.split(',');
  return parts.map(part => {
    const [type, name] = part.trim().split(' ');
    return { type, name };
  });
}

function DecodedSchema({ schemaString }) {
  const schemaParts = parseSchema(schemaString);

  return (
    <div className=" rounded-lg bg-gray-50 p-2">
      <div className="mb-2 text-sm font-semibold">Decoded Schema:</div>
      <div className="flex flex-wrap items-start justify-start gap-2">
        {schemaParts.map((part, index) => (
          <div key={index} className="whitespace-nowrap rounded-lg border border-gray-300 bg-white p-1 text-xs">
            {part.type}<br />{part.name}
          </div>
        ))}
      </div>
    </div>
  );
}





const AttestationList = ({ attestations }) => {
  const [searchValue, setSearchValue] = useState('');
  const [showDetails, setShowDetails] = useState(false);

  const handleChange = (event) => {
    setSearchValue(event.target.value);
  };

  console.log(attestations)

  return (
    <div className="flex flex-col p-5">
      <h1 className="mb-5 text-3xl font-bold">Attestations</h1>
      <Search handleChange={handleChange} value={searchValue} />
      <FilterResults
        value={searchValue}
        data={attestations || []}
        renderResults={(results) => (
          results.length === 0 ? <div>No results found!</div> : results.map((attestation, index) => (
            <div key={index} className="mt-6 w-4xl overflow-hidden rounded-lg border border-gray-200 bg-white shadow-md">
              <div className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="relative mr-2">
                      <svg className="h-8 w-8 text-gray-800" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24">
                        <path fillRule="evenodd" d="M4 4a2 2 0 0 0-2 2v12a2 2 0 0 0 .087.586l2.977-7.937A1 1 0 0 1 6 10h12V9a2 2 0 0 0-2-2h-4.532l-1.9-2.28A2 2 0 0 0 8.032 4H4Zm2.693 8H6.5l-3 8H18l3-8H6.693Z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <h5 className="text-xl font-semibold text-gray-900" title={attestation.schemaUID}>{attestation.schemaUID.slice(0, 8)}...{attestation.schemaUID.slice(-6)}</h5>
                  </div>
                  <div className="ml-4">
                    <span className="rounded bg-indigo-100 px-2.5 py-1 text-sm font-medium text-indigo-800"> {attestation.schemaDetails.attestationsCount} Attestations</span>
                    <span className="ml-1 rounded bg-indigo-50 px-2.5 py-1 text-sm font-medium text-indigo-800"> {renderNetworkID(attestation.networkID)}</span>

                  </div>
                </div>
                <p className="mt-2 text-sm text-gray-500 break-words">{attestation.schemaDescription}</p>
                <div className="mt-5 rounded-lg bg-gray-50 p-2">
                  <DecodedSchema schemaString={attestation.schemaDetails.schema} />
                  {showDetails && (
                    <>
                      <div className="mb-2 mt-4 font-semibold">Schema Info:</div>
                      <div className="flex flex-wrap items-start justify-start gap-1">
                        <div className="text-xs text-gray-600"><strong>Schema UID:</strong> {attestation.schemaUID}</div>
                        <div className="text-xs text-gray-600"><strong>Creator:</strong> {attestation.schemaDetails.creator}</div>
                        <div className="text-xs text-gray-600"><strong>ID:</strong> {attestation.schemaDetails.id}</div>
                        <div className="text-xs text-gray-600"><strong>Resolver:</strong> {attestation.schemaDetails.resolver}</div>
                        <div className="text-xs text-gray-600 break-normal"><strong>Revocable:</strong> {attestation.schemaDetails.revocable ? 'Yes' : 'No'}</div>
                      </div>
                    </>
                  )}
                </div>
                <div className="flex items-center justify-between mt-4">
                  <div className="flex items-center">
                    <button
                      className="mr-4 inline-flex items-center text-sm font-medium text-indigo-500 hover:underline"
                      onClick={() => setShowDetails(!showDetails)}
                    >
                      {showDetails ? 'Hide Schema Info' : 'Show Schema Info'}
                    </button>
                    <a href={`https://optimism.easscan.org/schema/view/${attestation.schemaUID}`} className="inline-flex items-center text-sm font-medium text-indigo-600 hover:underline">
                      View Attestations
                      <svg className="ml-2.5 h-3 w-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 18 18">
                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11v4.833A1.166 1.166 0 0 1 13.833 17H2.167A1.167 1.167 0 0 1 1 15.833V4.167A1.166 1.166 0 0 1 2.167 3h4.618m4.447-2H17v5.768M9.111 8.889l7.778-7.778" />
                      </svg>
                    </a>
                  </div>
                  <span className="rounded px-2.5 py-1 text-xs font-medium text-indigo-600">
                    Created: <TimeSince dateString={attestation.schemaDetails.time} />
                  </span>
                </div>

              </div>
            </div>
          ))
        )}
      />
    </div>
  );
};

export default AttestationList;
