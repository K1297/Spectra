import { createPublicClient, createWalletClient, http, fallback } from "viem"
import { custom } from "viem"

export const SOMNIA_CHAIN_ID = 50312
export const SOMNIA_RPC_PRIMARY = "https://dream-rpc.somnia.network"
export const SOMNIA_RPC_FALLBACK = "https://dream-rpc.somnia.network" // Same for now, but structure allows for alternatives
export const SOMNIA_EXPLORER = "https://shannon-explorer.somnia.network"

const somniaChain = {
  id: SOMNIA_CHAIN_ID,
  name: "Somnia Testnet",
  network: "somnia",
  nativeCurrency: {
    decimals: 18,
    name: "Somnia Token",
    symbol: "STT",
  },
  rpcUrls: {
    default: { http: [SOMNIA_RPC_PRIMARY] },
    public: { http: [SOMNIA_RPC_PRIMARY] },
  },
  blockExplorers: {
    default: { name: "Shannon Explorer", url: SOMNIA_EXPLORER },
  },
}

export const publicClient = createPublicClient({
  chain: somniaChain,
  transport: fallback([
    http(SOMNIA_RPC_PRIMARY, {
      timeout: 10000,
      retryCount: 3,
      retryDelay: 1000,
    }),
  ]),
})

export const getWalletClient = (account: `0x${string}`) => {
  if (typeof window === "undefined" || !window.ethereum) {
    throw new Error("MetaMask not available")
  }

  return createWalletClient({
    chain: somniaChain,
    account,
    transport: custom(window.ethereum),
  })
}
