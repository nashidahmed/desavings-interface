import { WagmiConfig, configureChains, createConfig } from "wagmi"
import Header from "../components/Header"
import "../styles/globals.css"
import type { AppProps } from "next/app"
import { goerli } from "viem/chains"
import { createWeb3Modal, walletConnectProvider } from "@web3modal/wagmi"
import { WalletConnectConnector } from "wagmi/connectors/walletConnect"
import { InjectedConnector } from "wagmi/connectors/injected"
import { MetaMaskConnector } from "wagmi/connectors/metaMask"

// 1. Get projectId
const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID as string

// 2. Create wagmiConfig
const { chains, publicClient } = configureChains(
  [goerli],
  [walletConnectProvider({ projectId })]
)

const wagmiConfig = createConfig({
  autoConnect: true,
  connectors: [
    new WalletConnectConnector({ options: { projectId, showQrModal: false } }),
    new InjectedConnector({ options: { shimDisconnect: true } }),
    new MetaMaskConnector({ chains }),
  ],
  publicClient,
})

console.log(projectId)
// 3. Create modal
createWeb3Modal({ wagmiConfig, projectId, chains })

export default function App({ Component, pageProps }: AppProps) {
  return (
    <WagmiConfig config={wagmiConfig}>
      <div className="container mx-auto px-60">
        <Header />
        <main className="">
          <Component {...pageProps} />
        </main>
      </div>
    </WagmiConfig>
  )
}
