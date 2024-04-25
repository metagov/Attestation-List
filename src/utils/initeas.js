import { EAS, Offchain, SchemaEncoder, SchemaRegistry } from "@ethereum-attestation-service/eas-sdk";
import { ethers } from 'ethers';

export const EASContractAddress = "0x4200000000000000000000000000000000000021"; // Optimism v1.0.1

export const eas = new EAS(EASContractAddress);

// Gets a default provider (in production use something else like infura/alchemy)
export const provider = ethers.providers.getDefaultProvider(
  "optimism"
);

// Initialize SchemaEncoder with the schema string
export const schemaEncoder = new SchemaEncoder("bytes32[] schemaUID,string[] schemaDescription,uint256[] networkID,string issuerName,string issuerDescription,string logo,string apiDocsURI");

