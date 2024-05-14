import React from 'react';
import { Link } from 'react-router-dom';

function formatName(name) {
  const breakInterval = 5;
  let chunks = [];
  if (name) {
    for (let i = 0; i < name.length; i += breakInterval) {
      const chunk = name.slice(i, i + breakInterval);
      // Wrap each chunk in a span with a zero-width space at the end to encourage breaking
      chunks.push(<span key={i}>{chunk}&#8203;</span>);
    }
    return <>{chunks}</>;
  } else
    return <></>;
}


function Card({ data, name }) {
  const logoURL = data.logo.startsWith('http') ? data.logo.trim() : `https://via.placeholder.com/150`;
  console.log(data)

  return (
    <Link to={`/schemas?id=${data.id}`} className="no-underline">
      <div className="mx-auto mt-6 overflow-hidden rounded-lg border border-gray-200 bg-white shadow-md sm:max-w-sm md:max-w-lg">
        <div className="p-4 sm:p-6">
          <div className="flex flex-col items-center justify-between md:flex-row m-2">
            <div className="flex items-center space-x-0">
              <div className="relative">
                <img
                  alt={`${data.name} logo`}
                  src={logoURL}
                  onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/150';
                  }}
                  className='h-14 w-14'
                />
              </div>
              <h5 className="text-xl font-semibold text-gray-900 break-words p-2">
                {formatName(data.name)}
              </h5>
            </div>
            <div className="mt-4 ml-2 flex flex-col md:mt-0">
              <span className="mb-1 rounded bg-indigo-100 px-1 py-0.5 text-sm font-medium text-indigo-800 sm:px-2.5 sm:py-1"> {data.schemas.length} Schemas</span>
              {/* <span className="rounded bg-indigo-100 px-1 py-0.5 text-sm font-medium text-indigo-800 sm:px-2.5 sm:py-1">1350 Attestations</span> */}
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}

export default Card;
