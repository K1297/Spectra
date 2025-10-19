"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"

const SOMNIA_CHAIN_ID = "0xc4a8" // 50312 in hex

interface WalletConnectProps {
  onConnect: (account: string) => void
  onConnecting: (connecting: boolean) => void
}

export function WalletConnect({ onConnect, onConnecting }: WalletConnectProps) {
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const connectWallet = async () => {
    setError(null)
    setIsLoading(true)
    onConnecting(true)

    try {
      if (!window.ethereum) {
        throw new Error("MetaMask not installed. Please install MetaMask to play Spectra.")
      }

      // Request account access
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      })

      if (!accounts || accounts.length === 0) {
        throw new Error("No accounts found")
      }

      // Switch to Somnia Testnet
      try {
        await window.ethereum.request({
          method: "wallet_switchEthereumChain",
          params: [{ chainId: SOMNIA_CHAIN_ID }],
        })
      } catch (switchError: any) {
        // Chain not added, add it
        if (switchError.code === 4902) {
          try {
            await window.ethereum.request({
              method: "wallet_addEthereumChain",
              params: [
                {
                  chainId: SOMNIA_CHAIN_ID,
                  chainName: "Somnia Testnet",
                  rpcUrls: ["https://dream-rpc.somnia.network"],
                  nativeCurrency: {
                    name: "Somnia Token",
                    symbol: "STT",
                    decimals: 18,
                  },
                  blockExplorerUrls: ["https://shannon-explorer.somnia.network"],
                },
              ],
            })
          } catch (addError: any) {
            throw new Error(`Failed to add Somnia network: ${addError.message}`)
          }
        } else {
          throw switchError
        }
      }

      onConnect(accounts[0])
    } catch (err: any) {
      console.error("[v0] Connection error:", err)
      setError(err.message || "Failed to connect wallet")
    } finally {
      setIsLoading(false)
      onConnecting(false)
    }
  }

  return (
    <div className="space-y-4">
      <div className="bg-gradient-to-br from-purple-900/50 to-blue-900/50 border border-purple-500/30 rounded-lg p-8 backdrop-blur-sm">
        <h2 className="text-2xl font-bold mb-4 text-center">Connect Wallet</h2>
        <p className="text-purple-200 text-center mb-6">
          Connect your MetaMask wallet to play Spectra on Somnia Testnet
        </p>

        <Button
          onClick={connectWallet}
          disabled={isLoading}
          className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-bold py-3 rounded-lg transition-all duration-200"
        >
          {isLoading ? "Connecting..." : "Connect MetaMask"}
        </Button>
      </div>

      {error && (
        <Alert className="bg-red-900/50 border-red-500/50">
          <AlertDescription className="text-red-200">{error}</AlertDescription>
        </Alert>
      )}

      <div className="text-xs text-purple-300 text-center space-y-1">
        <p>Network: Somnia Testnet (Chain ID: 50312)</p>
        <p>RPC: https://dream-rpc.somnia.network</p>
      </div>
    </div>
  )
}
