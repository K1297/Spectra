"use client"

import { useState, useCallback } from "react"
import { publicClient, getWalletClient } from "@/lib/web3-config"
import { CHROMATIC_MYSTERY_ADDRESS, CHROMATIC_MYSTERY_ABI } from "@/lib/chromatic-mystery-abi"
import { parseEther, formatEther } from "viem"

export interface MysteryState {
  player: string
  stake: bigint
  score: bigint
  active: boolean
  currentMysteryIndex: number
  lastRoundTimestamp: bigint
  mysterySequence: number[]
  sequenceProgress: number
}

export function useChromaticMystery(account: string) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const startMystery = useCallback(
    async (stakeAmount: string) => {
      setLoading(true)
      setError(null)

      try {
        const client = getWalletClient(account as `0x${string}`)
        const stakeInWei = parseEther(stakeAmount)

        const hash = await client.writeContract({
          address: CHROMATIC_MYSTERY_ADDRESS as `0x${string}`,
          abi: CHROMATIC_MYSTERY_ABI,
          functionName: "startMystery",
          account: account as `0x${string}`,
          value: stakeInWei,
        })

        const receipt = await publicClient.waitForTransactionReceipt({ hash })
        return receipt
      } catch (err: any) {
        const errorMsg = err.message || "Failed to start mystery game"
        setError(errorMsg)
        throw err
      } finally {
        setLoading(false)
      }
    },
    [account],
  )

  const guessMysteryColor = useCallback(
    async (colorId: number) => {
      setLoading(true)
      setError(null)

      try {
        const client = getWalletClient(account as `0x${string}`)

        const hash = await client.writeContract({
          address: CHROMATIC_MYSTERY_ADDRESS as `0x${string}`,
          abi: CHROMATIC_MYSTERY_ABI,
          functionName: "guessMysteryColor",
          account: account as `0x${string}`,
          args: [colorId as any],
        })

        const receipt = await publicClient.waitForTransactionReceipt({ hash })
        return receipt
      } catch (err: any) {
        const errorMsg = err.message || "Failed to submit guess"
        setError(errorMsg)
        throw err
      } finally {
        setLoading(false)
      }
    },
    [account],
  )

  const claimMysteryReward = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      const client = getWalletClient(account as `0x${string}`)

      const hash = await client.writeContract({
        address: CHROMATIC_MYSTERY_ADDRESS as `0x${string}`,
        abi: CHROMATIC_MYSTERY_ABI,
        functionName: "claimMysteryReward",
        account: account as `0x${string}`,
      })

      const receipt = await publicClient.waitForTransactionReceipt({ hash })
      return receipt
    } catch (err: any) {
      const errorMsg = err.message || "Failed to claim reward"
      setError(errorMsg)
      throw err
    } finally {
      setLoading(false)
    }
  }, [account])

  const getMysteryState = useCallback(async () => {
    try {
      const data = await publicClient.readContract({
        address: CHROMATIC_MYSTERY_ADDRESS as `0x${string}`,
        abi: CHROMATIC_MYSTERY_ABI,
        functionName: "getMystery",
        args: [account as `0x${string}`],
      })

      if (!data) return null

      const state = data as any
      return {
        player: state.player,
        stake: state.stake,
        score: state.score,
        active: state.active,
        currentMysteryIndex: state.currentMysteryIndex,
        lastRoundTimestamp: state.lastRoundTimestamp,
        mysterySequence: state.mysterySequence || [],
        sequenceProgress: state.sequenceProgress,
      } as MysteryState
    } catch (err) {
      console.error("[v0] Error fetching mystery state:", err)
      return null
    }
  }, [account])

  const getPotentialMysteryReward = useCallback(async () => {
    try {
      const state = await getMysteryState()
      if (!state) return "0"

      const reward = await publicClient.readContract({
        address: CHROMATIC_MYSTERY_ADDRESS as `0x${string}`,
        abi: CHROMATIC_MYSTERY_ABI,
        functionName: "getPotentialReward",
        args: [account as `0x${string}`],
      })

      return formatEther(reward as bigint)
    } catch (err) {
      console.error("[v0] Error fetching potential reward:", err)
      return "0"
    }
  }, [account, getMysteryState])

  return {
    startMystery,
    guessMysteryColor,
    claimMysteryReward,
    getMysteryState,
    getPotentialMysteryReward,
    loading,
    error,
  }
}
