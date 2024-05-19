import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import FilterResults from 'react-filter-search';
import Card from './card';
import Search from './search';

const apiUrl = "https://attestation-list-api.onrender.com/schema_attestations/0x25eb07102ee3f4f86cd0b0c4393457965b742b8acc94aa3ddbf2bc3f62ed1381";

export default function AllLists() {
  const [value, setValue] = useState('');
  const [attestations, setAttestations] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  function handleChange(e) {
    setValue(e.target.value);
  }

  useEffect(() => {
    setLoading(true);
    const fetchAttestations = async () => {
      try {
        const response = await fetch(apiUrl);
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        setAttestations(data);
      } catch (error) {
        console.error('Failed to fetch attestations:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAttestations();
  }, []);

  // Memoize the formatted data for rendering
  const data = useMemo(() => {
    return attestations.map(attester => ({
      id: attester.attesterAddress,
      name: attester.issuerName,
      description: attester.issuerDescription,
      logo: attester.logo,
      apiDocsURI: attester.apiDocsURI,
      schemas: attester.schemas
    }));
  }, [attestations]);


  // Limit displayed cards to 3
  const limitedData = data.slice(0, 3);

  return (
    <section className="min-h-screen w-full py-10 px-4 sm:px-10 flex flex-col gap-6">
      {/* <div className="flex justify-end">
        <Search handleChange={handleChange} value={value} setValue={setValue} />
      </div> */}

      <div className="overflow-y-auto h-[calc(100vh-10rem)] mt-20 px-5 sm:px-0 mx-auto max-w-6xl hidden-scrollbar">
        {loading ? (
          <div className="flex justify-center items-center min-h-[400px]">
            <div role="status">
              <svg aria-hidden="true" className="inline w-8 h-8 text-gray-50 animate-spin dark:text-gray-200 fill-indigo-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
                <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
              </svg>
              <span className="sr-only">Loading...</span>
            </div>
          </div>
        ) : (
          <FilterResults
            value={value}
            data={limitedData}
            renderResults={(results) => {
              console.log("Rendering results:", results); // Log the results to see what is being processed
              if (results.length === 0) {
                return <div>None found!</div>;
              } else {
                return (
                  <div className="flex flex-col gap-4">
                    {results.map((result) => {
                      if (result.schemas && result.schemas.length !== 0) {
                        console.log("Rendering card for:", result); // Log each result being rendered to a card
                        return <Card key={result.id} data={result} />;
                      } else {
                        console.log("No schemas available for:", result); // Log if a result has no schemas
                        return null;
                      }
                    })}
                  </div>
                );
              }
            }}
          />
        )}
        {/* <div className="flex justify-center mt-4">
          <button
            onClick={() => navigate('/explore')}
            className="bg-indigo-800 text-white px-4 py-2 rounded-md"
          >
            Explore
          </button>
        </div> */}
      </div>
    </section>
  );
}
