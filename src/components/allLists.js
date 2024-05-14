import React, { useState, useEffect, useMemo } from 'react';
import FilterResults from 'react-filter-search';
import Card from './card';
import Search from './search';

const apiUrl = "https://attestation-list-api.onrender.com/schema_attestations/0x25eb07102ee3f4f86cd0b0c4393457965b742b8acc94aa3ddbf2bc3f62ed1381";

export default function AllLists() {
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
      logo: attester.logo.trim(),
      apiDocsURI: attester.apiDocsURI,
      schemas: attester.schemas
    }));
  }, [attestations]);

  return (
    <section className="min-h-screen w-full py-20 px-0 md:px-10 grid gap-6">
      <Search handleChange={handleChange} value={value} setValue={setValue} />

      <div className="overflow-y-auto max-h-screen px-5 md:px-0 max-w-6xl mx-auto" style={{ height: 'calc(100vh - 10rem)' }}>
        {loading ? (
          <div className="flex justify-center items-center h-full w-full">
            <div className="loader"></div>
          </div>
        ) : (
          <FilterResults
            value={value}
            data={data}
            renderResults={(results) =>
              results.length === 0
                ? <div>None found!</div>
                : <div className="flex flex-col space-y-4">
                    {results.map((result) => (
                      <Card key={result.id} data={result} />
                    ))}
                  </div>
            }
          />
        )}
      </div>
    </section>
  );
}
