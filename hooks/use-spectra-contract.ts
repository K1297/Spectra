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
        console.log("[v0] Starting game with stake:", stakeAmount)
        console.log("[v0] Account:", account)
        console.log("[v0] Contract address:", SPECTRA_CONTRACT_ADDRESS)

        const walletClient = getWalletClient(account as `0x${string}`)
        const stakeInWei = parseEther(stakeAmount)
        console.log("[v0] Stake in Wei:", stakeInWei.toString())

        try {
          const gasEstimate = await publicClient.estimateContractGas({
            address: SPECTRA_CONTRACT_ADDRESS as `0x${string}`,
            abi: SPECTRA_ABI,
            functionName: "startGame",
            account: account as `0x${string}`,
            value: stakeInWei,
          })
          console.log("[v0] Gas estimate:", gasEstimate.toString())
        } catch (gasErr: any) {
          console.error("[v0] Gas estimation error:", gasErr)
          // Continue anyway, let the transaction fail with more details
        }

        const hash = await walletClient.writeContract({
          address: SPECTRA_CONTRACT_ADDRESS as `0x${string}`,
          abi: SPECTRA_ABI,
          functionName: "startGame",
          value: stakeInWei,
        })

        console.log("[v0] Transaction hash:", hash)

        const receipt = await Promise.race([
          publicClient.waitForTransactionReceipt({ hash }),
          new Promise((_, reject) => setTimeout(() => reject(new Error("Transaction confirmation timeout")), 60000)),
        ])

        console.log("[v0] Transaction confirmed:", receipt)
        return receipt
      } catch (err: any) {
        console.error("[v0] Error starting game:", err)
        console.error("[v0] Full error object:", JSON.stringify(err, null, 2))

        let errorMsg = err.message || "Failed to start game"

        if (errorMsg.includes("reverted")) {
          errorMsg =
            "Contract rejected the transaction. This may be due to: insufficient balance, contract issue, or network problem. Please check the contract on the explorer."
        } else if (errorMsg.includes("eth_chainId")) {
          errorMsg = "Network connection failed. Please check your internet connection and try again."
        } else if (errorMsg.includes("insufficient funds")) {
          errorMsg = "Insufficient STT balance. Please get more STT from the faucet."
        } else if (errorMsg.includes("user rejected")) {
          errorMsg = "Transaction rejected by user."
        } else if (errorMsg.includes("timeout")) {
          errorMsg = "Transaction took too long. Please try again."
        } else if (errorMsg.includes("gas")) {
          errorMsg = "Gas estimation failed. Please try again or check your balance."
        }

        setError(errorMsg)
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
        console.log("[v0] Choosing color:", colorId)
        const walletClient = getWalletClient(account as `0x${string}`)

        const hash = await walletClient.writeContract({
          address: SPECTRA_CONTRACT_ADDRESS as `0x${string}`,
          abi: SPECTRA_ABI,
          functionName: "chooseColor",
          args: [colorId as any],
        })

        console.log("[v0] Transaction hash:", hash)

        const receipt = await Promise.race([
          publicClient.waitForTransactionReceipt({ hash }),
          new Promise((_, reject) => setTimeout(() => reject(new Error("Transaction confirmation timeout")), 60000)),
        ])

        console.log("[v0] Transaction confirmed:", receipt)
        return receipt
      } catch (err: any) {
        console.error("[v0] Error choosing color:", err)

        let errorMsg = err.message || "Failed to choose color"
        if (errorMsg.includes("eth_chainId")) {
          errorMsg = "Network connection failed. Please check your internet connection."
        } else if (errorMsg.includes("timeout")) {
          errorMsg = "Transaction took too long. Please try again."
        } else if (errorMsg.includes("reverted")) {
          errorMsg = "Game ended or invalid color choice."
        }

        setError(errorMsg)
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
      console.log("[v0] Claiming reward")
      const walletClient = getWalletClient(account as `0x${string}`)

      const hash = await walletClient.writeContract({
        address: SPECTRA_CONTRACT_ADDRESS as `0x${string}`,
        abi: SPECTRA_ABI,
        functionName: "claimReward",
      })

      console.log("[v0] Transaction hash:", hash)

      const receipt = await Promise.race([
        publicClient.waitForTransactionReceipt({ hash }),
        new Promise((_, reject) => setTimeout(() => reject(new Error("Transaction confirmation timeout")), 60000)),
      ])

      console.log("[v0] Transaction confirmed:", receipt)
      return receipt
    } catch (err: any) {
      console.error("[v0] Error claiming reward:", err)

      let errorMsg = err.message || "Failed to claim reward"
      if (errorMsg.includes("eth_chainId")) {
        errorMsg = "Network connection failed. Please check your internet connection."
      } else if (errorMsg.includes("timeout")) {
        errorMsg = "Transaction took too long. Please try again."
      }

      setError(errorMsg)
      throw err
    } finally {
      setLoading(false)
    }
  }, [account])

  const getGameState = useCallback(async () => {
    if (!account) return null

    try {
      console.log("[v0] Fetching game state for:", account)
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
      console.log("[v0] Fetching potential reward for:", account)
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
