import '../styles/globals.css';
import '@rainbow-me/rainbowkit/styles.css';
import type { AppProps } from 'next/app';
import { RainbowKitProvider, getDefaultWallets } from '@rainbow-me/rainbowkit';
import { configureChains, createClient, WagmiConfig } from 'wagmi';
import { mainnet, polygon, optimism, arbitrum, goerli } from 'wagmi/chains';
import { alchemyProvider } from 'wagmi/providers/alchemy';
import { publicProvider } from 'wagmi/providers/public';
import { Chain } from 'wagmi/chains';
import { jsonRpcProvider } from 'wagmi/providers/jsonRpc';

const wallabyTestnet: Chain = {
  name: "Wallaby Testnet",
  id: 31415,
  network: 'avalanche',
  // iconUrl: 'https://example.com/icon.svg',
  // iconBackground: '#fff',
  nativeCurrency: {
    decimals: 18,
    name: 'Testnet FIL',
    symbol: 'tFIL',
  },
  rpcUrls: {
    default: {
      http: ['https://wallaby.node.glif.io/rpc/v0 '],
    },
  },
  blockExplorers: {
    default: { name: 'FilScan', url: 'https://wallaby.filscan.io' },
  },
  testnet: true,
}



const { chains, provider, webSocketProvider } = configureChains(
  [
    wallabyTestnet,
    ...(process.env.NEXT_PUBLIC_ENABLE_TESTNETS === 'true' ? [goerli] : []),
  ],
  [
    alchemyProvider({
      // This is Alchemy's default API key.
      // You can get your own at https://dashboard.alchemyapi.io
      apiKey: '_gg7wSSi0KMBsdKnGVfHDueq6xMB9EkC',
    }),
    publicProvider(),
  ]
);

const { connectors } = getDefaultWallets({
  appName: 'RainbowKit App',
  chains,
});

const wagmiClient = createClient({
  autoConnect: true,
  connectors,
  provider,
  webSocketProvider,
});

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <WagmiConfig client={wagmiClient}>
      <RainbowKitProvider chains={chains}>
        <Component {...pageProps} />
      </RainbowKitProvider>
    </WagmiConfig>
  );
}

export default MyApp;
