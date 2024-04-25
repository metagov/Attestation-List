import { FallbackProvider, JsonRpcProvider, BrowserProvider} from 'ethers';
import { useEffect, useState, useMemo } from 'react';
import { useWalletClient, usePublicClient } from 'wagmi';

// Convert public client to a Provider
export function publicClientToProvider(publicClient) {
  const { chain, transport } = publicClient;
  const network = {
    chainId: chain.id,
    name: chain.name,
    ensAddress: chain.contracts?.ensRegistry?.address,
  };
  if (transport.type === 'fallback') {
    const providers = transport.transports.map(
      ({ value }) => new JsonRpcProvider(value?.url, network)
    );
    if (providers.length === 1) return providers[0];
    return new FallbackProvider(providers);
  }
  return new JsonRpcProvider(transport.url, network);
}

// Convert wallet client to a Signer
export function walletClientToSigner(walletClient) {
  const { account, chain, transport } = walletClient;
  const network = {
    chainId: chain.id,
    name: chain.name,
    ensAddress: chain.contracts?.ensRegistry?.address,
  };
  const provider = new BrowserProvider(transport, network)
  const signer = provider.getSigner(account.address);

  return signer;
}

// Hook to get Signer from wallet client
export function useSigner() {
  const { data: walletClient } = useWalletClient();

  const signer = useMemo(() => {
    if (!walletClient) return undefined;

    return walletClientToSigner(walletClient);
  }, [walletClient]);

  return signer;
}

// Hook to get Provider from public client
export function useProvider() {
  const publicClient = usePublicClient();

  const provider = useMemo(() => {
    if (!publicClient) return undefined;

    return publicClientToProvider(publicClient);
  }, [publicClient]);

  return provider;
}
