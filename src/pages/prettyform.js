import Header from '../components/header'
import { ConnectKitButton } from "connectkit";
import React, { useEffect, useState } from 'react'
import { useForm, useFieldArray } from 'react-hook-form';
import { eas, provider, schemaEncoder } from '../utils/initeas';
import { useEthersSigner, useSigner } from '../utils/wagmiutils';
import { useAccount, useNetwork } from "wagmi";
import { ethers, isBytesLike } from "ethers";
import ErrorBoundary from '../components/errorboundary';
import { lookupGraphqlScanner } from '../utils/getChainId';
import Toast from '../components/toast';

export async function verifyCreator(networkId, schemaId, connectedAddress) {
    const endpoint = lookupGraphqlScanner(networkId);
    if (endpoint === "Unknown chain ID") {
        console.error("Unsupported network ID.");
        alert("Unsupported Netowork ID");

        return false;
    }

    const query = `
        query GetSchema($where: SchemaWhereUniqueInput!) {
            getSchema(where: $where) {
                creator
            }
        }
    `;
    const variables = {
        where: {
            id: schemaId
        }
    };

    try {
        const response = await fetch(endpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            body: JSON.stringify({
                query,
                variables
            })
        });

        const jsonResponse = await response.json();
        console.log(jsonResponse)
        if (jsonResponse.data && jsonResponse.data.getSchema) {
            return jsonResponse.data.getSchema.creator === connectedAddress;
        } else {
            console.error("No data returned from the query.");
            return false;
        }
    } catch (error) {
        console.error("Error querying GraphQL endpoint:", error);
        return false;
    }
}



export default function PrettyForm() {

    const { address, isConnected, chain } = useAccount();
    const signer = useEthersSigner();
    const [isChecked, setIsChecked] = useState(false);
    const [loading, setLoading] = useState(false);

    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');
    const [toastType, setToastType] = useState('success'); // 'success', 'danger', 'warning'

    const verifyCreatorAsync = async (networkId, schemaUid) => {
        if (!chain || !address) {
            setToastType('warning');
            setToastMessage("Wallet not connected.");
            setShowToast(true);
            return false;
        }
        if (!networkId || !schemaUid) {
            setToastType('warning');
            setToastMessage("Incomplete data for verification.");
            setShowToast(true);
            return false;
        }
        const result = await verifyCreator(networkId, schemaUid, address);
        if (result === false) {
            setToastType('danger');
            setToastMessage("Verification failed: You are not the creator of this schema or this schema does not exist.");
            setShowToast(true);
            return false;
        }
        return true;
    };


    const handleToggle = () => {
        setIsChecked(!isChecked);
    };
    const { register, handleSubmit, setError, getValues, formState: { errors }, control, watch } = useForm({
        defaultValues: {
            schemaUids: [{ value: "" }],
            schemaDescriptions: [{ value: "" }],
            networkIds: [{ value: "" }],
            issuerName: "",
            issuerDescription: "",
            logoUri: "https://optimism.easscan.org/logo2.png?v=3",
            apiDocsUri: "",
        },
        mode: 'onTouched'
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
        console.log(JSON.stringify(data, null, 2));
        // alert(JSON.stringify(data, null, 2)); // Pretty print the JSON data

        if (!isConnected || !chain) {
            //alert('Please connect your wallet to make an attestation')
            setToastType('warning');
            setToastMessage("Wallet not connected.");
            setShowToast(true);


        }

        eas.connect(signer);
        const encodedData = schemaEncoder.encodeData([
            { name: "schemaUID", value: data.schemaUids.map(uid => uid.value), type: "bytes32[]" },
            { name: "schemaDescription", value: data.schemaDescriptions.map(desc => desc.value), type: "string[]" },
            { name: "networkID", value: data.networkIds.map(id => parseInt(id.value)), type: "uint256[]" },
            { name: "issuerName", value: data.issuerName, type: "string" },
            { name: "issuerDescription", value: data.issuerDescription, type: "string" },
            { name: "logo", value: data.logoUri, type: "string" },
            { name: "apiDocsURI", value: data.apiDocsUri, type: "string" },
        ]);

        const schemaUID = "0x25eb07102ee3f4f86cd0b0c4393457965b742b8acc94aa3ddbf2bc3f62ed1381";
        const tx = await eas.attest({
            schema: schemaUID,
            data: {
                recipient: data.recipient ? data.recipient : address, // default is connected wallet address
                expirationTime: 0,
                revocable: data.isRevoked ? data.isRevoked : true,
                // refUID: (data.referencedAttestation && isBytesLike(data.referencedAttestation))
                //     ? data.referencedAttestation : "0x0000000000000000000000000000000000000000000000000000000000000000",
                data: encodedData,
            },
        });

        console.log("Form Submitted")
        console.log(encodedData);

        const newAttestationUID = await tx.wait();
        if (newAttestationUID !== '') {
            setToastType('success');
            setToastMessage("Attestation successful!");
            setShowToast(true);
            //alert("Attestation successful!", newAttestationUID);
            console.log("New attestation UID:", newAttestationUID);
        }

    };


    const addAllFields = async () => {
        const lastIndex = schemaUidFields.length - 1; // Index of the last item
        if (lastIndex >= 0) {
            const networkId = parseInt(getValues(`networkIds.${lastIndex}.value`), 10);
            const schemaUid = getValues(`schemaUids.${lastIndex}.value`);

            const isCreator = await verifyCreatorAsync(networkId, schemaUid);
            if (isCreator !== true) {
                setToastType('warning');
                setToastMessage("Verification failed: You are not the creator of this schema.");
                setShowToast(true);
                //alert("Verification failed: You are not the creator of this schema.");
                return;
            }
        }

        // If verification passes or no items yet, append new fields
        appendSchemaUid({ value: '' });
        appendSchemaDesc({ value: '' });
        appendNetworkId({ value: '' });
    };

    const removeAllFieldsAtIndex = () => {
        removeSchemaUid(-1);
        removeSchemaDesc(-1);
        removeNetworkId(-1);
    };


    return (
        <ErrorBoundary fallback={(error, resetError) => (
            <div>
                <p>An error occurred: {error.message}</p>
                <button onClick={resetError}>Try Again</button>
            </div>
        )}>
            <div className="app">
                <Header back={true} />

                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="space-y-12 mt-28 px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12">
                        <div className="border-b border-gray-900/10 pb-12">
                            <h1 className="text-2xl font-semibold leading-7 text-indigo-600">Register Your DAO Schemas</h1>
                            <p className="mt-1 text-sm leading-6 text-gray-600">
                                Connect your wallet to get started.
                                All your Schema registrations will be displayed on the explorer under Issuer profile.
                            </p>
                            <h1 className="text-lg mt-2 font-semibold leading-7 text-indigo-500">Valid Schemas checklist:</h1>

                            <div class="flex items-center mb-1">
                                <input id="checkbox-1" type="checkbox" value="" class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500" />
                                <label for="default-checkbox" class="ms-2 ml-1 text-sm font-medium text-gray-900 ">Ensure correct Schema UID on EAS Supported networks</label>
                            </div>
                            <div class="flex items-center mb-1">
                                <input id="checkbox-2" type="checkbox" value="" class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500" />
                                <label for="checked-checkbox" class="ms-2 ml-1 text-sm font-medium text-gray-900">
                                    Schema has context set or has a context field in schema. Click here {" "}
                                    <a class=" mx-1 text-blue-500 underline" href='https://hackmd.io/@torchablazed/HJiY6wKIR'>[Link]</a> {" "}
                                    for a tutorial on setting a context for your schema
                                </label>
                            </div>

                            <div class="flex items-center mb-1">
                                <input id="checkbox-3" type="checkbox" value="" class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500" />
                                <label for="checked-checkbox" class="ms-2 ml-1 text-sm font-medium text-gray-900">Ensure you are the creator of the schema you are attesting</label>
                            </div>
                            <div className="flex mt-10">
                                <p className="mt-1 mr-2 text-sm leading-6 text-gray-600">
                                    You are attesting as
                                </p>
                                <ConnectKitButton />
                            </div>

                        </div>


                        <div className="border-b border-gray-900/10 pb-12">
                            <h2 className="text-base font-semibold leading-7 text-indigo-600">Add Your DAO Schemas</h2>
                            <p className="mt-1 text-sm leading-6 text-gray-600">
                                Provide the Schema UID, Description, and the corresponding Network ID for each schema you add.
                            </p>
                            <p className="mt-1 text-sm leading-6 text-gray-600">
                                You can only attest to the schemas you have created and for which you have set the context in the mentioned schema.
                            </p>
                            <a href="https://optimism.easscan.org/schema/view/0xcc6c9b07bfccd15c8f313d23bf4389fb75629a620c5fa669c898bf1e023f2508"
                                className="text-indigo-600 text-xs hover:text-indigo-800 visited:text-indigo-600 underline transition-colors duration-300"
                                target="_blank"
                                rel="noopener noreferrer">
                                View Schema
                            </a>

                            <div className="mt-5">
                                {networkIdFields.map((item, index) => (

                                    <div key={item.id} className="grid grid-cols-1 gap-y-8">
                                        <h2 className="text-base font-semibold leading-7 text-indigo-400 mt-10">Schema {index}</h2>
                                        <Toast type={toastType} message={toastMessage} onClose={() => setShowToast(false)} isVisible={showToast} />

                                        <div>
                                            <label htmlFor={`networkIds.${index}.value`} className="text-sm font-medium text-gray-900">Network ID</label>
                                            <p className="text-xs font-light text-gray-400">Select the network on which your Schema exists.</p>

                                            <div className="mt-2">
                                                <select {...register(`networkIds.${index}.value`, {
                                                    required: (<p className="text-sm text-red-800">
                                                        "Please select the network for your Schema"
                                                    </p>),

                                                })} className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-black-600 sm:max-w-xs sm:text-sm sm:leading-6">
                                                    <option value="1">Ethereum</option>
                                                    <option value="10">Optimism</option>
                                                    <option value="42161">Arbitrum-One</option>
                                                    <option value="2001">Base</option>
                                                    <option value="777">Linea</option>
                                                </select>
                                            </div>
                                            {errors.networkIds?.[index]?.value && (
                                                <p className="text-sm text-red-800 mt-1">
                                                    {errors.networkIds[index].value.message}
                                                </p>
                                            )}

                                        </div>

                                        <div>
                                            <label htmlFor={`schemaUids.${index}.value`} className="text-sm font-medium text-gray-900">Schema UID</label>
                                            <input {...register(`schemaUids.${index}.value`, {
                                                required:
                                                    "Schema UID is required",
                                                pattern: {
                                                    value: /^0x[0-9A-Fa-f]{64}$/,
                                                    message: "Schema UID must be a 64-character hexadecimal value starting with 0x"
                                                }
                                            })} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" />
                                            {errors.schemaUids?.[index]?.value && (
                                                <p className="text-sm text-red-800 mt-1">
                                                    {errors.schemaUids[index].value.message}
                                                </p>
                                            )}                                        </div>
                                        <div>
                                            <label htmlFor={`schemaDescriptions.${index}.value`} className="text-sm font-medium text-gray-900">Schema Description</label>
                                            <textarea {...register(`schemaDescriptions.${index}.value`, {
                                                required: true, minLength: {
                                                    value: 20,
                                                    message: "Schema description must be at least 20 characters"
                                                }
                                            })} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" rows="3"></textarea>
                                            {errors.schemaDescriptions?.[index]?.value && <p className="text-sm text-red-800 mt-1">{errors.schemaDescriptions[index].value.message}</p>}
                                        </div>
                                    </div>
                                ))}

                                <div className="mt-6 flex items-center justify-end gap-x-6 mb-2">
                                    <button type="button" onClick={removeAllFieldsAtIndex}
                                        className="text-sm font-semibold leading-6 text-gray-900">
                                        Remove
                                    </button>
                                    <button
                                        type="button"
                                        onClick={addAllFields}
                                        className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-slate-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black-600"
                                    >
                                        Add
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="border-b border-gray-900/10 pb-12">
                            <h2 className="text-base font-semibold leading-7 text-indigo-600">Issuer Infromation</h2>
                            <p className="mt-1 text-sm leading-6 text-gray-600">
                                This is used to create an Issuer profile. Please ensure the Issuer information remains consistent if you are registering multiple times.
                            </p>


                            <div className="mt-5 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">

                                <div className="sm:col-span-3">
                                    <label htmlFor="issuerName" className="block text-sm font-medium leading-6 text-gray-900">
                                        Issuer Name
                                    </label>
                                    <div className="mt-2">
                                        <input
                                            type="text"
                                            name="issuerName"
                                            id="issuerName"
                                            {...register("issuerName", {
                                                required: true,
                                                maxLength: {
                                                    value: 8,
                                                    message: "Issuer name must be max 8 characters"
                                                },
                                                minLength: {
                                                    value: 2,
                                                    message: "Issuer name must be at least 3 characters"
                                                }
                                            })}
                                            autoComplete="issuer-name"
                                            className="block w-full rounded-md border-0 py-1.5 pl-3 px-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-black-600 sm:text-sm sm:leading-6"
                                        />
                                        {errors.issuerName && <p className="text-sm text-red-800 mt-1">{errors.issuerName.message}</p>}

                                    </div>
                                </div>

                                <div className="col-span-full">
                                    <label htmlFor="issuerDescription" className="block text-sm font-medium leading-6 text-gray-900">
                                        Issuer Description
                                    </label>
                                    <div className="mt-2">
                                        <textarea
                                            id="issuerDescription"
                                            name="issuerDescription"
                                            rows={3}
                                            {...register("issuerDescription", {
                                                required: true, minLength: {
                                                    value: 20,
                                                    message: "Issuer description must be at least 20 characters"
                                                }
                                            })}
                                            className="block w-full rounded-md border-0 py-1.5 pl-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-black-600 sm:text-sm sm:leading-6"
                                            defaultValue={''}
                                        />
                                        {errors.issuerDescription && <p className="text-sm text-red-800 mt-1">{errors.issuerDescription.message}</p>}

                                    </div>
                                    <p className="mt-3 text-sm leading-6 text-gray-600">Write a few sentences describing the issuer.</p>
                                </div>

                                <div className="sm:col-span-4">
                                    <label htmlFor="logoUri" className="block text-sm font-medium leading-6 text-gray-900">
                                        Logo URI
                                    </label>
                                    <div className="mt-2">
                                        <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-black-600 sm:max-w-md">
                                            <input
                                                type="text"
                                                name="logoUri"
                                                id="logoUri"
                                                {...register("logoUri", {

                                                    pattern: {
                                                        value: /^(https?|chrome):\/\/[^\s$.?#].[^\s]*$/,
                                                        message: 'Invalid URI' // custom message
                                                    }
                                                })}
                                                autoComplete="logoUri"
                                                className="block flex-1 border-0 bg-transparent py-1.5 pl-3 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                                                placeholder="https://example.com/logo.png"
                                            />
                                        </div>
                                        {errors.logoUri && <p className="text-sm text-red-800 mt-1">{errors.logoUri.message}</p>}

                                    </div>
                                </div>

                                <div className="sm:col-span-4">
                                    <label htmlFor="apiDocsUri" className="block text-sm font-medium leading-6 text-gray-900">
                                        API Docs URI
                                    </label>
                                    <div className="mt-2">
                                        <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-black-600 sm:max-w-md">
                                            <input
                                                type="text"
                                                name="apiDocsUri"
                                                id="apiDocsUri"
                                                {...register("apiDocsUri", {
                                                    required: true, pattern: {
                                                        value: /^(https?|chrome):\/\/[^\s$.?#].[^\s]*$/,
                                                        message: 'Invalid URI' // custom message
                                                    }
                                                })}
                                                autoComplete="apiDocsUri"
                                                className="block flex-1 border-0 bg-transparent py-1.5 pl-3 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                                                placeholder="https://example.com/docs"
                                            />
                                        </div>
                                        {errors.apiDocsUri && <p className="text-sm text-red-800 mt-1">{errors.apiDocsUri.message}</p>}

                                    </div>
                                </div>
                            </div>
                        </div>



                        <div className="border-b border-gray-900/10 pb-12">
                            <div className="mt-2 flex items-center flex-start gap-x-6 mb-8">

                                <button
                                    type="button"
                                    onClick={() => setShowAdvanced(!showAdvanced)}
                                    className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-slate-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black-600"
                                >
                                    {showAdvanced ? 'Hide Additional Settings' : 'Show Additional Settings'}
                                </button>
                            </div>

                            {showAdvanced && (<div>
                                <h2 className="text-base font-semibold leading-7 text-gray-900">Additional Settings</h2>
                                <p className="mt-1 text-sm leading-6 text-gray-600">
                                    By default, expiry is not set, recipient is self, referenced attestations are none and revocable is false.
                                </p>

                                <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">

                                    <div className="sm:col-span-3">
                                        <label htmlFor="expirationTime" className="block text-sm font-medium leading-6 text-gray-900">
                                            Expiration Time
                                        </label>
                                        <div className="mt-2">
                                            <input
                                                type="text"
                                                name="expirationTime"
                                                id="expirationTime"
                                                {...register("expirationTime", {
                                                    valueAsNumber: true, // Ensures the input is parsed as a number
                                                    pattern: {
                                                        value: /^[0-9]*$/, // Regex to allow only numbers
                                                        message: "Expiration time must be a numeric value" // Error message if regex fails
                                                    }
                                                })}
                                                autoComplete="expirationTime"
                                                placeholder='Time in secs'
                                                className="block w-full rounded-md border-0 py-1.5 pl-3 px-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-black-600 sm:text-sm sm:leading-6"
                                            />
                                            {errors.expirationTime && <p className="text-sm text-red-800 mt-1">{errors.expirationTime.message}</p>}

                                        </div>
                                    </div>

                                    {/* <div className="col-span-full">
                                    <label htmlFor="referenceAttestation" className="block text-sm font-medium leading-6 text-gray-900">
                                        Referenced Attestation
                                    </label>
                                    <div className="mt-2">
                                        <input
                                            id="referenceAttestation"
                                            name="referenceAttestation"
                                            rows={3}
                                            {...register("referencedAttestation", {
                                                pattern: {
                                                    value: /^0x[0-9A-Fa-f]{64}$/,
                                                    message: "Schema UID must be a 64-character hexadecimal value starting with 0x"
                                                }
                                            })}
                                            placeholder='Schema UID'
                                            className="block w-full rounded-md border-0 py-1.5 pl-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-black-600 sm:text-sm sm:leading-6"
                                            defaultValue={''}
                                        />
                                    </div>
                                </div> */}
                                    <div className="sm:col-span-4">
                                        <label htmlFor="isRevocable" className="block text-sm font-medium leading-6 text-gray-900">
                                            Is Revocable?
                                        </label>
                                        <div className="mt-2">
                                            <div className="flex items-center mb-4">
                                                <input
                                                    id="default-radio-1"
                                                    type="radio"
                                                    value="true"
                                                    name="default-radio"
                                                    {...register("isRevoked")}
                                                    className="w-4 h-4 text-blue-600 bg-white border-gray-300 focus:ring-blue-600 focus:ring-2"
                                                />
                                                <label htmlFor="default-radio-1" className="ml-2 text-sm font-medium text-gray-900">
                                                    Yes
                                                </label>
                                            </div>
                                            <div className="flex items-center">
                                                <input
                                                    id="default-radio-2"
                                                    type="radio"
                                                    value="false"
                                                    name="default-radio"
                                                    {...register("isRevoked")}
                                                    className="w-4 h-4 text-blue-600 bg-white border-gray-300 focus:ring-blue-600 focus:ring-2"
                                                />
                                                <label htmlFor="default-radio-2" className="ml-2 text-sm font-medium text-gray-900">
                                                    No
                                                </label>
                                            </div>
                                            {errors.isRevoked && <p className="text-sm text-red-800 mt-1">{errors.isRevoked.message}</p>}

                                        </div>
                                    </div>



                                    <div className="sm:col-span-4 mt-1">
                                        <label htmlFor="recipient" className="block text-sm font-medium leading-6 text-gray-900">
                                            Recipient
                                        </label>
                                        <div className="mt-2">
                                            <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-black-600 sm:max-w-md">
                                                <input
                                                    type="text"
                                                    name="recipient"
                                                    id="recipient"
                                                    autoComplete="recepient"
                                                    className="block flex-1 border-0 bg-transparent py-1.5 pl-3 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                                                    placeholder="0x..."
                                                    {...register("recipient")}
                                                />
                                                {errors.recipient && <p className="text-sm text-red-800 mt-1">{errors.recipient.message}</p>}
                                            </div>
                                        </div>
                                    </div>

                                </div>

                            </div>)}
                        </div>
                        <div className=" flex items-center justify-end gap-x-6 mb-8 sm:mr-2">
                            <button
                                type="submit"
                                disabled={loading}
                                className="rounded-md bg-indigo-800 mb-8 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black-600"
                            >
                                Submit
                            </button>
                        </div>

                    </div>


                </form>
            </div>
        </ErrorBoundary>
    )
}
