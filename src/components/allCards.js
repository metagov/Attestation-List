import React, { useState, useEffect, useMemo } from 'react';
import FilterResults from 'react-filter-search';
import Card from './card';
import Search from './search';

const apiUrl = "https://attestation-list-api.onrender.com/schema_attestations/0x25eb07102ee3f4f86cd0b0c4393457965b742b8acc94aa3ddbf2bc3f62ed1381";

export default function AllAttestations() {
  const [value, setValue] = useState('');
  const [attestations, setAttestations] = useState([]);
  const [loading, setLoading] = useState(false);

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
        console.log('Fetched data:', data); // Log fetched data
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
    const transformedData = attestations.map(attester => ({
      id: attester.attesterAddress,
      name: attester.issuerName,
      description: attester.issuerDescription,
      logo: attester.logo,
      apiDocsURI: attester.apiDocsURI,
      schemas: attester.schemas
    }));
    console.log('Transformed data:', transformedData); // Log transformed data
    return transformedData;
  }, [attestations]);


  const demoData = [
    { id: 1, name: "Issuer 1", description: "Description for Issuer 1", logo: "https://via.placeholder.com/150", apiDocsURI: "https://example.com", schemas: ["schema1" ,"kkkk"] },
    { id: 2, name: "Issuer 2", description: "Description for Issuer 2", logo: "https://via.placeholder.com/150", apiDocsURI: "https://example.com", schemas: ["schema2"] },
    { id: 3, name: "Issuer 3", description: "Description for Issuer 3", logo: "https://via.placeholder.com/150", apiDocsURI: "https://example.com", schemas: ["schema3"] },
    { id: 4, name: "Issuer 4", description: "Description for Issuer 4", logo: "https://via.placeholder.com/150", apiDocsURI: "https://example.com", schemas: ["schema4"] },
    { id: 5, name: "Issuer 5", description: "Description for Issuer 5", logo: "https://via.placeholder.com/150", apiDocsURI: "https://example.com", schemas: ["schema5"] },
    { id: 6, name: "Issuer 6", description: "Description for Issuer 6", logo: "https://via.placeholder.com/150", apiDocsURI: "https://example.com", schemas: ["schema6"] },
    { id: 7, name: "Issuer 7", description: "Description for Issuer 7", logo: "https://via.placeholder.com/150", apiDocsURI: "https://example.com", schemas: ["schema7"] },
    { id: 8, name: "Issuer 8", description: "Description for Issuer 8", logo: "https://via.placeholder.com/150", apiDocsURI: "https://example.com", schemas: ["schema8"] },
    { id: 9, name: "Issuer 9", description: "Description for Issuer 9", logo: "https://via.placeholder.com/150", apiDocsURI: "https://example.com", schemas: ["schema9"] },
  ];

  return (
    <section className="min-h-screen w-full md:max-w-screen-xl py-10 px-4 sm:px-10 flex flex-col gap-6">
      <div className="flex justify-between items-center sm:flex-col">
        <h1 className="text-2xl font-medium text-indigo-800">Explore DAO Attestation Issuers</h1>
        <div className="mt-10">
          <Search handleChange={handleChange} value={value} setValue={setValue} />
        </div>
      </div>

      <div className="overflow-y-auto h-[calc(100vh-10rem)] px-5 sm:px-0 mx-auto max-w-6xl hidden-scrollbar">
        {loading ? (
          <div className="flex justify-center items-center">
            <div role="status">
              <svg aria-hidden="true" className="inline w-8 h-8 text-gray-50 animate-spin fill-indigo-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
                <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
              </svg>
              <span className="sr-only">Loading...</span>
            </div>
          </div>
        ) : (
          <FilterResults
            value={value}
            data={demoData}
            renderResults={(results) => {
              console.log("Rendering results:", results); 
              if (results.length === 0) {
                return <div>None found!</div>;
              } else {
                return (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {results.map((result) => {
                      if (result.schemas && result.schemas.length !== 0) {
                        console.log("Rendering card for:", result); 
                        return <Card key={result.id} data={result} />;
                      } else {
                        console.log("No schemas available for:", result);
                        return null;
                      }
                    })}
                  </div>
                );
              }
            }}
          />
        )}
      </div>
    </section>
  );
}
