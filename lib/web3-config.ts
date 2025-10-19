import { createPublicClient, createWalletClient, http } from "viem"
import { custom } from "viem"

export const SOMNIA_CHAIN_ID = 50312
export const SOMNIA_RPC = "https://dream-rpc.somnia.network"
export const SOMNIA_EXPLORER = "https://shannon-explorer.somnia.network"

export const publicClient = createPublicClient({
  chain: {
    id: SOMNIA_CHAIN_ID,
    name: "Somnia Testnet",
    network: "somnia",
    nativeCurrency: {
      decimals: 18,
      name: "Somnia Token",
      symbol: "STT",
    },
    rpcUrls: {
      default: { http: [SOMNIA_RPC] },
      public: { http: [SOMNIA_RPC] },
    },
    blockExplorers: {
      default: { name: "Shannon Explorer", url: SOMNIA_EXPLORER },
    },
  },
  transport: http(SOMNIA_RPC),
})

export const getWalletClient = (account: `0x${string}`) => {
  if (typeof window === "undefined" || !window.ethereum) {
    throw new Error("MetaMask not available")
  }

  return createWalletClient({
    chain: {
      id: SOMNIA_CHAIN_ID,
      name: "Somnia Testnet",
      network: "somnia",
      nativeCurrency: {
        decimals: 18,
        name: "Somnia Token",
        symbol: "STT",
      },
      rpcUrls: {
        default: { http: [SOMNIA_RPC] },
        public: { http: [SOMNIA_RPC] },
      },
      blockExplorers: {
        default: { name: "Shannon Explorer", url: SOMNIA_EXPLORER },
      },
    },
    account,
    transport: custom(window.ethereum),
  })
}
