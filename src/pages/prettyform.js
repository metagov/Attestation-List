import Header from '../components/header'
import { ConnectKitButton } from "connectkit";
import React, { useEffect, useState } from 'react'
import { useForm, useFieldArray } from 'react-hook-form';
import { eas, provider, schemaEncoder } from '../utils/initeas';
import { useEthersSigner, useSigner } from '../utils/wagmiutils';
import { useAccount, useNetwork } from "wagmi";
import { ethers, isBytesLike } from "ethers";
import ErrorBoundary from '../components/errorboundary';


export default function PrettyForm() {

    const { address, isConnected, chain } = useAccount();
    const signer = useEthersSigner();
    const [isChecked, setIsChecked] = useState(false);

    const handleToggle = () => {
        setIsChecked(!isChecked);
    };
    const { register, handleSubmit, formState: { errors }, control, watch } = useForm({
        defaultValues: {
            schemaUids: [{ value: "" }],
            schemaDescriptions: [{ value: "" }],
            networkIds: [{ value: "" }],
            issuerName: "",
            issuerDescription: "",
            logoUri: "https://optimism.easscan.org/logo2.png?v=3",
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
        console.log(JSON.stringify(data, null, 2));
        // alert(JSON.stringify(data, null, 2)); // Pretty print the JSON data

        if (!isConnected || !chain) {
            alert('Please connect your wallet to make an attestation')

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
            alert("New attestation UID Created:", newAttestationUID);
            console.log("New attestation UID:", newAttestationUID);
        }

    };

    const addAllFields = () => {
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
                            <h1 className="text-2xl font-semibold leading-7 text-gray-900 ">Register your DAO Schema</h1>
                            <p className="mt-1 text-sm leading-6 text-gray-600">
                                Connect your wallet to get started.
                                All your DAO Schema registrations will be displayed on the explorer under Issuer profile.
                            </p>
                            <div className="flex mt-10">
                                <p className="mt-1 mr-2 text-sm leading-6 text-gray-600">
                                    You are attesting as
                                </p>
                                <ConnectKitButton />
                            </div>

                        </div>

                        <div className="border-b border-gray-900/10 pb-12">
                            <h2 className="text-base font-semibold leading-7 text-gray-900">Add your DAO Schemas</h2>
                            <p className="mt-1 text-sm leading-6 text-gray-600">Provide Schema UID, Description and the coresponding Network ID for each schema you add.</p>

                            <div className="mt-5">
                                {networkIdFields.map((item, index) => (

                                    <div key={item.id} className="grid grid-cols-1 gap-y-8">
                                        <h2 className="text-base font-semibold leading-7 text-gray-900 mt-10">Schema {index}</h2>

                                        <div>
                                            <label htmlFor={`networkIds.${index}.value`} className="text-sm font-medium text-gray-900">Network ID</label>
                                            <div class="mt-2">
                                                <select {...register(`networkIds.${index}.value`, {
                                                    required: (<p className="text-sm text-red-800">
                                                        "Network ID is required"
                                                    </p>)
                                                })} className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-black-600 sm:max-w-xs sm:text-sm sm:leading-6">
                                                    <option value="1">Ethereum</option>
                                                    <option value="10">Optimism</option>
                                                    <option value="137">Polygon</option>
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
                                        className="rounded-md bg-slate-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-slate-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black-600"
                                    >
                                        Add
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="border-b border-gray-900/10 pb-12">
                            <h2 className="text-base font-semibold leading-7 text-gray-900">Issuer Infromation</h2>
                            <p className="mt-1 text-sm leading-6 text-gray-600">
                                This is used to create Issuer profile, please keep the Issuer info consistent if you are registering multiple times.
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
                                                minLength: {
                                                    value: 3,
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
                                    className="rounded-md bg-slate-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-slate-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black-600"
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
                                className="rounded-md bg-black mb-8 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-slate-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black-600"
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
