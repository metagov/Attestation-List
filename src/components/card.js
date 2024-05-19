import React from 'react';
import { Link } from 'react-router-dom';

function formatName(name) {
  if (!name) return <></>; 

  // Find the first space within the first 8 characters
  const maxChars = 12;
  let end = Math.min(name.length, maxChars); // Prevent exceeding the name's length
  let spaceIndex = name.substring(0, end).indexOf(' ');

  // If a space is found within the limit, adjust the breaking point
  if (spaceIndex > -1) {
    end = spaceIndex;
  }

  // Extract the segment and the rest of the name
  const segment = name.substring(0, end);
  const rest = name.substring(end);

  return (
    <>
      <span className="inline-block">{segment}&#8203;</span>
      {/* {rest && <span className="inline-block">{rest}</span>} */}
    </>
  );
}


function Card({ data }) {
  const logoURL = data.logo.startsWith('http') ? data.logo.trim() : `https://via.placeholder.com/150`;

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
                  e.target.onerror = null; // Prevents looping
                  e.target.src = 'https://via.placeholder.com/150';
                }}
                className="h-14 w-14"
              />
              <h5 className="text-xl sm:text-xl font-semibold text-gray-900 max-w-[100px]">
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
