"use client"

import { useState, useCallback } from "react"
import { parseEther, formatEther } from "viem"
import { publicClient, getWalletClient } from "@/lib/web3-config"
import { SPECTRA_ABI, SPECTRA_CONTRACT_ADDRESS } from "@/lib/contract-abi"

export interface GameState {
  player: string
  stake: string
  score: number
  active: boolean
  lastRoundTimestamp: number
}

export function useSpectraContract(account: string | null) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const startGame = useCallback(
    async (stakeAmount: string) => {
      if (!account) throw new Error("No account connected")

      setLoading(true)
      setError(null)

      try {
        const walletClient = getWalletClient(account as `0x${string}`)

        const hash = await walletClient.writeContract({
          address: SPECTRA_CONTRACT_ADDRESS as `0x${string}`,
          abi: SPECTRA_ABI,
          functionName: "startGame",
          value: parseEther(stakeAmount),
        })

        console.log("[v0] Transaction hash:", hash)

        // Wait for transaction
        const receipt = await publicClient.waitForTransactionReceipt({ hash })
        console.log("[v0] Transaction confirmed:", receipt)

        return receipt
      } catch (err: any) {
        const errorMsg = err.message || "Failed to start game"
        setError(errorMsg)
        console.error("[v0] Error starting game:", err)
        throw err
      } finally {
        setLoading(false)
      }
    },
    [account],
  )

  const chooseColor = useCallback(
    async (colorId: number) => {
      if (!account) throw new Error("No account connected")

      setLoading(true)
      setError(null)

      try {
        const walletClient = getWalletClient(account as `0x${string}`)

        const hash = await walletClient.writeContract({
          address: SPECTRA_CONTRACT_ADDRESS as `0x${string}`,
          abi: SPECTRA_ABI,
          functionName: "chooseColor",
          args: [colorId as any],
        })

        console.log("[v0] Transaction hash:", hash)

        const receipt = await publicClient.waitForTransactionReceipt({ hash })
        console.log("[v0] Transaction confirmed:", receipt)

        return receipt
      } catch (err: any) {
        const errorMsg = err.message || "Failed to choose color"
        setError(errorMsg)
        console.error("[v0] Error choosing color:", err)
        throw err
      } finally {
        setLoading(false)
      }
    },
    [account],
  )

  const claimReward = useCallback(async () => {
    if (!account) throw new Error("No account connected")

    setLoading(true)
    setError(null)

    try {
      const walletClient = getWalletClient(account as `0x${string}`)

      const hash = await walletClient.writeContract({
        address: SPECTRA_CONTRACT_ADDRESS as `0x${string}`,
        abi: SPECTRA_ABI,
        functionName: "claimReward",
      })

      console.log("[v0] Transaction hash:", hash)

      const receipt = await publicClient.waitForTransactionReceipt({ hash })
      console.log("[v0] Transaction confirmed:", receipt)

      return receipt
    } catch (err: any) {
      const errorMsg = err.message || "Failed to claim reward"
      setError(errorMsg)
      console.error("[v0] Error claiming reward:", err)
      throw err
    } finally {
      setLoading(false)
    }
  }, [account])

  const getGameState = useCallback(async () => {
    if (!account) return null

    try {
      const result = await publicClient.readContract({
        address: SPECTRA_CONTRACT_ADDRESS as `0x${string}`,
        abi: SPECTRA_ABI,
        functionName: "getGame",
        args: [account as `0x${string}`],
      })

      console.log("[v0] Game state:", result)

      return {
        player: result[0],
        stake: formatEther(result[1]),
        score: Number(result[2]),
        active: result[3],
        lastRoundTimestamp: Number(result[4]),
      } as GameState
    } catch (err: any) {
      console.error("[v0] Error fetching game state:", err)
      return null
    }
  }, [account])

  const getPotentialReward = useCallback(async () => {
    if (!account) return "0"

    try {
      const result = await publicClient.readContract({
        address: SPECTRA_CONTRACT_ADDRESS as `0x${string}`,
        abi: SPECTRA_ABI,
        functionName: "getPotentialReward",
        args: [account as `0x${string}`],
      })

      return formatEther(result as bigint)
    } catch (err: any) {
      console.error("[v0] Error fetching potential reward:", err)
      return "0"
    }
  }, [account])

  return {
    startGame,
    chooseColor,
    claimReward,
    getGameState,
    getPotentialReward,
    loading,
    error,
  }
}
