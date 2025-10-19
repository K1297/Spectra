"use client"

import { useState, useEffect } from "react"
import { SpectraLogo } from "@/components/spectra-logo"
import { WalletConnect } from "@/components/wallet-connect"
import { GameBoard } from "@/components/game-board"

export default function Home() {
  const [account, setAccount] = useState<string | null>(null)
  const [isConnecting, setIsConnecting] = useState(false)

  useEffect(() => {
    // Check if wallet is already connected
    const checkConnection = async () => {
      if (typeof window !== "undefined" && window.ethereum) {
        try {
          const accounts = await window.ethereum.request({
            method: "eth_accounts",
          })
          if (accounts.length > 0) {
            setAccount(accounts[0])
          }
        } catch (error) {
          console.error("Error checking connection:", error)
        }
      }
    }

    checkConnection()
  }, [])

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950 text-white overflow-hidden">
      {/* Animated background grid */}
      <div className="fixed inset-0 opacity-10 pointer-events-none">
        <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(68,68,68,.2)_25%,rgba(68,68,68,.2)_50%,transparent_50%,transparent_75%,rgba(68,68,68,.2)_75%,rgba(68,68,68,.2))] bg-[length:60px_60px]" />
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 py-8">
        {/* Header */}
        <div className="mb-8 text-center">
          <SpectraLogo />
          <h1 className="text-5xl md:text-6xl font-bold mt-6 bg-gradient-to-r from-red-400 via-purple-400 to-blue-400 bg-clip-text text-transparent">
            SPECTRA
          </h1>
          <p className="text-lg text-purple-300 mt-2">One Mind vs the Spectrum</p>
        </div>

        {/* Main Content */}
        {!account ? (
          <div className="w-full max-w-md">
            <WalletConnect onConnect={setAccount} onConnecting={setIsConnecting} />
          </div>
        ) : (
          <div className="w-full max-w-2xl">
            <GameBoard account={account} />
          </div>
        )}

        {/* Footer */}
        <div className="mt-12 text-center text-sm text-purple-400">
          <p>Fully On-Chain • Somnia Testnet • Chain ID 50312</p>
        </div>
      </div>
    </main>
  )
}
