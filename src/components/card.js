import React from 'react';
import { Link } from 'react-router-dom';

function formatName(name) {
  const breakInterval = 5;
  let chunks = [];
  if (name) {
    for (let i = 0; i < name.length; i += breakInterval) {
      const chunk = name.slice(i, i + breakInterval);
      chunks.push(<span key={i}>{chunk}&#8203;</span>);
    }
    return <>{chunks}</>;
  } else
    return <></>;
}

function Card({ data, name }) {
  const logoURL = data.logo.startsWith('http') ? data.logo.trim() : `https://via.placeholder.com/150`;
  console.log(data);

  return (
    <Link to={`/schemas?id=${data.id}`} className="block no-underline">
      <div className="mx-auto mt-6 overflow-hidden rounded-lg border border-gray-200 bg-white shadow-md sm:max-w-md lg:max-w-lg">
        <div className="p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0 sm:space-x-4">
            <div className="flex items-center space-x-4">
              <img
                alt={`${data.name} logo`}
                src={logoURL}
                onError={(e) => {
                  e.target.onerror = null; // prevents looping
                  e.target.src = 'https://via.placeholder.com/150';
                }}
                className="h-14 w-14"
              />
              <h5 className="text-lg sm:text-xl font-semibold text-gray-900 break-all">
                {formatName(data.name)}
              </h5>
            </div>
            <div>
              <span className="rounded bg-indigo-100 px-2 py-1 text-sm sm:text-base font-medium text-indigo-800">
                {data.schemas.length} Schemas
              </span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}

export default Card;
