"use client"

import { useState, useEffect } from "react"
import { SpectraLogo } from "@/components/spectra-logo"
import { WalletConnect } from "@/components/wallet-connect"
import { GameBoard } from "@/components/game-board"
import { SpectraZone } from "@/components/spectra-zone"
import { MysteryBoard } from "@/components/mystery-board"

export default function Home() {
  const [account, setAccount] = useState<string | null>(null)
  const [isConnecting, setIsConnecting] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [selectedGame, setSelectedGame] = useState<string | null>(null)

  useEffect(() => {
    const checkConnection = async () => {
      try {
        if (typeof window !== "undefined" && window.ethereum) {
          // First check if we have a saved account in localStorage
          const savedAccount = localStorage.getItem("spectral_connected_account")

          // Get current connected accounts
          const accounts = await window.ethereum.request({
            method: "eth_accounts",
          })

          if (accounts.length > 0) {
            // If there are connected accounts, use the first one
            const connectedAccount = accounts[0]
            setAccount(connectedAccount)
            // Save to localStorage for persistence
            localStorage.setItem("spectral_connected_account", connectedAccount)
          } else if (savedAccount) {
            // If no accounts connected but we have a saved one, try to reconnect
            try {
              const requestedAccounts = await window.ethereum.request({
                method: "eth_requestAccounts",
              })
              if (requestedAccounts.length > 0) {
                setAccount(requestedAccounts[0])
                localStorage.setItem("spectral_connected_account", requestedAccounts[0])
              } else {
                // Clear saved account if reconnection fails
                localStorage.removeItem("spectral_connected_account")
              }
            } catch (error) {
              // User rejected, clear saved account
              localStorage.removeItem("spectral_connected_account")
            }
          }
        }
      } catch (error) {
        console.error("[v0] Error checking connection:", error)
      } finally {
        setIsLoading(false)
      }
    }

    checkConnection()

    if (typeof window !== "undefined" && window.ethereum) {
      const handleAccountsChanged = (accounts: string[]) => {
        if (accounts.length > 0) {
          setAccount(accounts[0])
          localStorage.setItem("spectral_connected_account", accounts[0])
        } else {
          setAccount(null)
          localStorage.removeItem("spectral_connected_account")
        }
      }

      window.ethereum.on("accountsChanged", handleAccountsChanged)
      return () => {
        window.ethereum.removeListener("accountsChanged", handleAccountsChanged)
      }
    }
  }, [])

  const handleDisconnect = () => {
    setAccount(null)
    localStorage.removeItem("spectral_connected_account")
    setSelectedGame(null)
  }

  if (isLoading) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950 text-white overflow-hidden flex items-center justify-center">
        <div className="text-center">
          <SpectraLogo />
          <p className="text-purple-300 mt-4">Loading...</p>
        </div>
      </main>
    )
  }

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
        ) : selectedGame === "spectrum-survival" ? (
          <div className="w-full max-w-2xl">
            <GameBoard account={account} onDisconnect={handleDisconnect} onBackToZone={() => setSelectedGame(null)} />
          </div>
        ) : selectedGame === "chromatic-mystery" ? (
          <div className="w-full max-w-2xl">
            <MysteryBoard
              account={account}
              onDisconnect={handleDisconnect}
              onBackToZone={() => setSelectedGame(null)}
            />
          </div>
        ) : (
          <div className="w-full max-w-4xl">
            <SpectraZone account={account} onSelectGame={setSelectedGame} onDisconnect={handleDisconnect} />
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
