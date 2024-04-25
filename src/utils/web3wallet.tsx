import { WagmiProvider, createConfig, http } from "wagmi";
import { optimism } from "wagmi/chains";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ConnectKitProvider, getDefaultConfig } from "connectkit";
import React from "react";

const config = createConfig(
  getDefaultConfig({
    // Your dApps chains
    chains: [optimism],
    transports: {
      // RPC URL for each chain
      [optimism.id]: http(
        `https://optimism-mainnet.infura.io/v3/${process.env.REACT_APP_ALCHEMY_ID}`,
      ),
    },

    // Required API Keys
    walletConnectProjectId: process.env.REACT_APP_WALLETCONNECT_PROJECT_ID!,

    // Required App Info
    appName: "Your App Name",

    // Optional App Info
    appDescription: "Your App Description",
    appUrl: "https://family.co", // your app's url
    appIcon: "https://family.co/logo.png", // your app's icon, no bigger than 1024x1024px (max. 1MB)
  }),
);
interface Props {
    children?: React.ReactNode; // This is technically unnecessary but added for explicitness
  }
const queryClient = new QueryClient();
export const Web3Provider: React.FC<Props>  = ({ children }) => {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <ConnectKitProvider>{children}</ConnectKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
};
