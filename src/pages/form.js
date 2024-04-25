import React, { useEffect, useState} from 'react'
import styled from 'styled-components';
import { useForm, useFieldArray } from 'react-hook-form';
import Header from '../components/header'
import '../index.css';
import { ConnectKitButton } from "connectkit"; 
import { eas, provider, schemaEncoder } from '../utils/initeas';
import { useSigner } from '../utils/wagmiutils';
import { useAccount, useNetwork } from "wagmi";
import { ethers } from "ethers";

const Content = styled.section`
  display: flex; // Use flexbox instead of grid
  justify-content: center; // Horizontally center the content
  align-items: center; // Vertically center the content (if needed)
  max-width: 800px; // Max width can be the same as your original grid's main column
  width: 100%; // Make sure it takes up the full width
  margin: 0 auto; // Center the entire container within its parent
  padding: 0 1.5rem; // Maintain padding on the sides
  box-sizing: border-box;
  min-height: 100vh; // Optional: makes the container fill the viewport height

  @media screen and (max-width: 960px) {
    max-width: none; // On smaller screens, allow it to take the full width
    padding: 0 1.5rem; // Adjust padding as necessary for smaller screens
  }
`;

const WalletContainer = styled.div`
  display: flex;
  justify-content: flex-end; // Aligns the button to the end of the container
  padding: 1em; // Add padding as necessary
`;
const Container = styled.div`
  width: 50vw;  // Half of the viewport width for larger screens
  min-width: 300px;  // Minimum width for smaller screens
  margin: 50px auto;  // Top and bottom margin with auto left and right margin for centering
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  background-color: #fff;
  display: flex;  // Flex container to center the content
  flex-direction: column;  // Stack children vertically
  align-self: center;  // Center children horizontally
  justify-content: center;  // Center children vertically, if needed

  @media (max-width: 768px) {
    width: 90vw;  // A larger percentage of the viewport width for smaller screens
    margin-top: 20px;  // Less vertical space on smaller screens
    margin-bottom: 20px;
  }
`;



const Title = styled.h1`
  color: #333;
  font-size: 24px;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
`;

const Input = styled.input`
  margin-bottom: 10px;
  padding: 10px;
  font-size: 16px;
  border: 1px solid #ccc;
  border-radius: 4px;
`;

const TextArea = styled.textarea`
  margin-bottom: 10px;
  padding: 10px;
  font-size: 16px;
  border: 1px solid #ccc;
  border-radius: 4px;
  height: 100px;
`;

const Button = styled.button`
  padding: 10px 20px;
  font-size: 16px;
  color: white;
  background-color: #000000;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover {
    background-color: #808080;
  }
`;

const RemoveButton = styled.button`
  width: fit-content;
  align-self: flex-end;
  margin-top: 10px;
  padding: 10px 20px;
  font-size: 16px;
  color: white;
  background-color: #000000;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;
  &:hover {
    background-color: #808080;
  }
  margin-bottom: 8px;
`;

const AddButton = styled.button`
  width: auto;
  padding: 10px 20px;
  font-size: 16px;
  color: white;
  background-color: #000000;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;
  &:hover {
    background-color: #808080;
  }
  margin-bottom: 8px;
`;

const FieldGroup = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 10px;
`;

const Error = styled.span`
  color: red;
  margin-bottom: 10px;
`;

const Label = styled.label`
  font-size: 16px;
  color: #6c757d; // A common shade of gray
  font-weight: bold; // Makes the text bold
  margin-bottom: 8px;
  margin-top: 15px;
  display: block; // Ensure the label appears above the input/textarea
`;


const AdvancedOptionsContainer = styled.section`
  background-color: #f7f7f7;
  padding: 20px;
  margin-top: 20px;
  border-radius: 8px;
`;

const ToggleButton = styled.button`
  background-color: #000000;
  color: white;
  border: none;
  border-radius: 20px;
  padding: 10px 20px;
  margin-right: 10px;
  cursor: pointer;

  &:focus {
    outline: none;
  }

  &.active {
    background-color: #808080;
  }
`;

function SubmitForm() {

    const { address, isConnected, chain } = useAccount();
    const signer = useSigner();

    

    const { register, handleSubmit, formState: { errors }, control, watch } = useForm({
        defaultValues: {
          schemaUids: [{ value: "" }],
          schemaDescriptions: [{ value: "" }],
          networkIds: [{ value: "" }],
          issuerName: "",
          issuerDescription: "",
          logo: "",
          apiDocsUri: "",
        }
      });
    
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [isRevocable, setIsRevocable] = useState(false);

  const { fields: schemaUidFields, append: appendSchemaUid, remove: removeSchemaUid } = useFieldArray({
    control,
    name: 'schemaUids'
  });

  const { fields: schemaDescFields, append: appendSchemaDesc, remove: removeSchemaDesc } = useFieldArray({
    control,
    name: 'schemaDescriptions'
  });

  const { fields: networkIdFields, append: appendNetworkId, remove: removeNetworkId } = useFieldArray({
    control,
    name: 'networkIds'
  });



  const onSubmit = async data => {

    if (!isConnected || !chain ) {
        alert('Please connect your wallet to make an attestation')

    }
    eas.connect(signer);

    const encodedData = schemaEncoder.encodeData([
      { name: "schemaUID", value: data.schemaUids.map(uid => uid.value), type: "bytes32[]" },
      { name: "schemaDescription", value: data.schemaDescriptions.map(desc => desc.value), type: "string[]" },
      { name: "networkID", value: data.networkIds.map(id => parseInt(id.value)), type: "uint256[]" },
      { name: "issuerName", value: data.issuerName, type: "string" },
      { name: "issuerDescription", value: data.issuerDescription, type: "string" },
      { name: "logo", value: data.logo, type: "string" },
      { name: "apiDocsURI", value: data.apiDocsUri, type: "string" },
    ]);

    const schemaUID = "0x25eb07102ee3f4f86cd0b0c4393457965b742b8acc94aa3ddbf2bc3f62ed1381";
    const tx = await eas.attest({
        schema: schemaUID,
        data: {
          recipient: data.recipient? data.recipient : address , // default is connected wallet address
          expirationTime: data.expirationTime? data.expirationTime : 0,
          revocable: isRevocable? isRevocable : true, // Be aware that if your schema is not revocable, this MUST be false
          data: encodedData,
        },
      });


    console.log("Form Submitted")
    console.log(encodedData);

    const newAttestationUID = await tx.wait();
    if (newAttestationUID !== ''){
        alert("New attestation UID Created:", newAttestationUID);
        console.log("New attestation UID:", newAttestationUID);
    }
       
  };




  return (
    <div className="app">
    <Header back={true}/>
    <Content>
    <Container>
      <Title>Attest to DAO Schema Registry</Title>
      <WalletContainer> <ConnectKitButton /> </WalletContainer>
      
      <Form onSubmit={handleSubmit(onSubmit)}>

        
        <Label>Recipient</Label>
        <Input {...register("recipient")} placeholder="Recipient (optional)" />
        
        {/* Dynamic Schema UID Fields */}
        <Label>Schema UID</Label>
        {schemaUidFields.map((item, index) => (
          <FieldGroup key={item.id}>
            <Input 
              {...register(`schemaUids.${index}.value`)} 
              placeholder="Schema UID 0x..." 
            />
            {index > 0 && (
              <RemoveButton 
                type="button" 
                onClick={() => removeSchemaUid(index)}
              >
                Remove
              </RemoveButton>
            )}
          </FieldGroup>
        ))}
        <AddButton 
          type="button" 
          onClick={() => appendSchemaUid({ value: "" })}
        >
          Add Schema UID
        </AddButton>

        {/* Dynamic Schema Description Fields */}
        <Label>Schema Description</Label>
        {schemaDescFields.map((item, index) => (
          <FieldGroup key={item.id}>
            <TextArea 
              {...register(`schemaDescriptions.${index}.value`)} 
              placeholder="Description" 
            />
            {index > 0 && (
              <RemoveButton type="button" onClick={() => removeSchemaDesc(index)}>
                Remove
              </RemoveButton>
            )}
          </FieldGroup>
        ))}
        <AddButton type="button" onClick={() => appendSchemaDesc({ value: "" })}>
          Add Schema Description
        </AddButton>

        {/* Dynamic Network ID Fields */}
        <Label>Network ID</Label>
        {networkIdFields.map((item, index) => (
          <FieldGroup key={item.id}>
            <Input 
              {...register(`networkIds.${index}.value`)} 
              placeholder="Network ID" 
            />
            {index > 0 && (
              <RemoveButton type="button" onClick={() => removeNetworkId(index)}>
                Remove
              </RemoveButton>
            )}
          </FieldGroup>
        ))}
        <AddButton type="button" onClick={() => appendNetworkId({ value: "" })}>
          Add Network ID
        </AddButton>

        <Label>Issuer Name</Label>
        <Input {...register("issuerName", { required: true })} placeholder="Issuer Name" />
        {errors.issuerName && <Error>Issuer name is required.</Error>}
        
        <Label>Issuer Description</Label>
        <TextArea {...register("issuerDescription")} placeholder="Issuer Description" />
        
        <Label>Logo URI</Label>
        <Input {...register("logo")} placeholder="https://ipfs.io/ipfs/cwpdfdfffff..." />

        <Label>API Docs URI</Label>
        <Input {...register("apiDocsUri")} placeholder="https://docs.project.com" />

        {/* Advanced Options Toggle */}
        <Button type="button" onClick={() => setShowAdvanced(!showAdvanced)}>
          {showAdvanced ? 'Hide Advanced Options' : 'Show Advanced Options'}
        </Button>

        {/* Advanced Options Section */}
        {showAdvanced && (
          <AdvancedOptionsContainer>
            <Label>Expiration Time (Optional)</Label>
            <Input {...register("expirationTime")} placeholder="Expiration time" />

            <Label>Referenced Attestation (Optional)</Label>
            <Input {...register("referencedAttestation")} placeholder="Referenced attestation UID" />

            <Label>Is Revocable?</Label>
            <div>
              <ToggleButton 
                className={isRevocable ? 'active' : ''} 
                onClick={() => setIsRevocable(true)}
              >
                Yes
              </ToggleButton>
              <ToggleButton 
                className={!isRevocable ? 'active' : ''} 
                onClick={() => setIsRevocable(false)}
              >
                No
              </ToggleButton>
            </div>
          </AdvancedOptionsContainer>
        )}

        <Button type="submit" style={{marginTop: "10px", backgroundColor: "#232b2b"}}>Submit</Button>
      </Form>
    </Container>
    </Content>
    </div>
  );
}

export default SubmitForm;
