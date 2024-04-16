import React, { useState } from 'react';
import styled from 'styled-components';
import Search from './search';
import FilterResults from 'react-filter-search';

// Styled components
const ListWrapper = styled.div`
  display: flex;
  flex-direction: column;
  padding: 20px;
`;

const Title = styled.h1`
  margin-bottom: 20px;
`;

const AttestationItem = styled.div`
  border: 1px solid #ccc;
  padding: 10px;
  border-radius: 8px;
  margin-bottom: 10px;
`;

const SchemaItem = styled.div`
  padding: 10px;
  border-top: 1px solid #eee;
  &:first-child {
    border-top: none;
  }
`;

const Detail = styled.div`
  margin-bottom: 5px;
  font-size: 14px;
`;

const AttestationList = ({ attestations }) => {
  const [searchValue, setSearchValue] = useState('');

  const handleChange = (event) => {
    setSearchValue(event.target.value);
  };

  console.log("Attestations data:", attestations); // Debugging output

  return (
    <ListWrapper>
      <Title>Attestations</Title>
      <Search handleChange={handleChange} value={searchValue} />
      <FilterResults
        value={searchValue}
        data={attestations || []}
        renderResults={(results) => (
          results.length === 0 ? <div>No results found!</div> : results.map((attestation, index) => (
            <AttestationItem key={index}>
              {/* Displaying attestation details based on available data */}
              <Detail>Network ID: {attestation.networkID}</Detail>
              <Detail>Description: {attestation.schemaDescription}</Detail>
              <Detail>Schema UID: {attestation.schemaUID}</Detail>
              {attestation.schemaDetails && (
                <SchemaItem>
                  <Detail>Creator: {attestation.schemaDetails.creator}</Detail>
                  <Detail>ID: {attestation.schemaDetails.id}</Detail>
                  <Detail>Resolver: {attestation.schemaDetails.resolver}</Detail>
                  <Detail>Revocable: {attestation.schemaDetails.revocable ? 'Yes' : 'No'}</Detail>
                </SchemaItem>
              )}
            </AttestationItem>
          ))
        )}
      />
    </ListWrapper>
  );
};

export default AttestationList;
