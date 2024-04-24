import React, { useEffect, useState} from 'react'
import styled from 'styled-components';
import { useForm, useFieldArray } from 'react-hook-form';
import Header from '../components/header'
import '../index.css';

const Content = styled.section`
  display: grid;
  grid-template-columns: 300px 800px;
  grid-gap: 48px;
  position: relative;
  box-sizing: border-box;

  @media screen and (max-width: 960px) {
    grid-template-columns: 1fr;
    grid-gap: 24px;
    padding: 0 1.5rem;
  }
`;

const Container = styled.div`
  width: 50vw; 
  min-width: 300px; 
  margin: 50px auto;  
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  background-color: #fff;

  @media (max-width: 768px) {
    width: 90vw;  =
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
  margin-bottom: 20px;
  padding: 10px;
  font-size: 16px;
  border: 1px solid #ccc;
  border-radius: 4px;
`;

const TextArea = styled.textarea`
  margin-bottom: 20px;
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
  background-color: #007BFF;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover {
    background-color: #0056b3;
  }
`;

const RemoveButton = styled.button`
  width: fit-content;
  align-self: flex-end;
  margin-top: 10px;
  padding: 10px 20px;
  font-size: 16px;
  color: white;
  background-color: #007BFF;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;
  &:hover {
    background-color: #0056b3;
  }
  margin-bottom: 10px;
`;

const AddButton = styled.button`
  width: auto;
  padding: 10px 20px;
  font-size: 16px;
  color: white;
  background-color: #007BFF;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;
  &:hover {
    background-color: #0056b3;
  }
  margin-bottom: 10px;
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
  display: block; // Ensure the label appears above the input/textarea
`;


const AdvancedOptionsContainer = styled.section`
  background-color: #f7f7f7;
  padding: 20px;
  margin-top: 20px;
  border-radius: 8px;
`;

const ToggleButton = styled.button`
  background-color: #007bff;
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
    background-color: #0056b3;
  }
`;

function SubmitForm() {
  const { register, handleSubmit, formState: { errors }, control } = useForm({
    defaultValues: {
      schemaUids: [{ value: "" }],
      schemaDescriptions: [{ value: "" }],
      networkIds: [{ value: "" }],
    }
  });
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [isRevocable, setIsRevocable] = useState(false);
  const onSubmit = data => {
    console.log(data);
  };

  const {
    fields: schemaUidFields,
    append: appendSchemaUid,
    remove: removeSchemaUid
  } = useFieldArray({
    control,
    name: "schemaUids"
  });

  const {
    fields: schemaDescFields,
    append: appendSchemaDesc,
    remove: removeSchemaDesc
  } = useFieldArray({ control, name: "schemaDescriptions" });

  const {
    fields: networkIdFields,
    append: appendNetworkId,
    remove: removeNetworkId
  } = useFieldArray({ control, name: "networkIds" });


  return (
    <div className="app">
    <Header back={true}/>
    <Content>
    <Container>
      <Title>Attest to DAO Schema Registry</Title>
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
            <Label>EXPIRATION TIME (OPTIONAL)</Label>
            <Input {...register("expirationTime")} placeholder="Set the expiration time of the attestation" />

            <Label>REFERENCED ATTESTATION (OPTIONAL)</Label>
            <Input {...register("referencedAttestation")} placeholder="Referenced attestation UID" />

            <Label>IS REVOCABLE</Label>
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

        <Button type="submit">Submit</Button>
      </Form>
    </Container>
    </Content>
    </div>
  );
}

export default SubmitForm;
