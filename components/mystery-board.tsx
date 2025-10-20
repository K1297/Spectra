"use client"

import { useState, useEffect } from "react"
import { ColorButton } from "@/components/color-button"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useChromaticMystery, type MysteryState } from "@/hooks/use-chromatic-mystery"
import { formatEther } from "viem"

const COLORS = [
  { id: 1, name: "Red", hex: "#ff4444" },
  { id: 2, name: "Blue", hex: "#4444ff" },
  { id: 3, name: "Green", hex: "#44ff44" },
  { id: 4, name: "Yellow", hex: "#ffff44" },
  { id: 5, name: "Violet", hex: "#ff44ff" },
]

interface MysteryBoardProps {
  account: string
  onDisconnect?: () => void
  onBackToZone?: () => void
}

export function MysteryBoard({ account, onDisconnect, onBackToZone }: MysteryBoardProps) {
  const [gameState, setGameState] = useState<MysteryState | null>(null)
  const [stakeAmount, setStakeAmount] = useState("0.01")
  const [selectedColor, setSelectedColor] = useState<number | null>(null)
  const [result, setResult] = useState<{ correct: boolean; message: string } | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [potentialReward, setPotentialReward] = useState("0")

  const {
    startMystery,
    guessMysteryColor,
    claimMysteryReward,
    getMysteryState,
    getPotentialMysteryReward,
    loading,
    error: contractError,
  } = useChromaticMystery(account)

  // Fetch game state on mount and periodically
  useEffect(() => {
    const fetchGameState = async () => {
      const state = await getMysteryState()
      setGameState(state)
      if (state) {
        const reward = await getPotentialMysteryReward()
        setPotentialReward(reward)
      }
    }

    fetchGameState()
    const interval = setInterval(fetchGameState, 5000)

    return () => clearInterval(interval)
  }, [getMysteryState, getPotentialMysteryReward])

  useEffect(() => {
    if (contractError) {
      setError(contractError)
    }
  }, [contractError])

  const handleStartMystery = async () => {
    setError(null)
    setIsLoading(true)
    setResult(null)

    try {
      if (!stakeAmount || Number.parseFloat(stakeAmount) < 0.01) {
        throw new Error("Stake must be at least 0.01 STT")
      }

      await startMystery(stakeAmount)

      let state = null
      let retries = 0
      const maxRetries = 5

      while (!state?.active && retries < maxRetries) {
        await new Promise((resolve) => setTimeout(resolve, 2000))
        state = await getMysteryState()
        retries++
      }

      if (state?.active) {
        setGameState(state)
        setError(null)
      } else {
        setError("Failed to start mystery game. Please try again.")
      }
    } catch (err: any) {
      setError(err.message || "Failed to start mystery game")
    } finally {
      setIsLoading(false)
    }
  }

  const handleGuessColor = async (colorId: number) => {
    if (!gameState?.active) return

    setError(null)
    setIsLoading(true)
    setSelectedColor(colorId)

    try {
      await guessMysteryColor(colorId)

      await new Promise((resolve) => setTimeout(resolve, 2000))

      const state = await getMysteryState()
      setGameState(state)

      if (state?.active) {
        setResult({
          correct: true,
          message: `Correct! You chose ${COLORS[colorId - 1].name}. Progress: ${state.sequenceProgress}/${state.mysterySequence.length}`,
        })
      } else {
        setResult({
          correct: false,
          message: `Wrong! Game Over! Mysteries Solved: ${state?.score || 0}`,
        })
      }
    } catch (err: any) {
      setError(err.message || "Failed to submit guess")
    } finally {
      setIsLoading(false)
    }
  }

  const handleClaimReward = async () => {
    setError(null)
    setIsLoading(true)

    try {
      await claimMysteryReward()

      setResult({
        correct: true,
        message: "Reward claimed successfully!",
      })

      setGameState(null)
      setSelectedColor(null)
    } catch (err: any) {
      setError(err.message || "Failed to claim reward")
    } finally {
      setIsLoading(false)
    }
  }

  const resetGame = () => {
    setGameState(null)
    setResult(null)
    setSelectedColor(null)
  }

  return (
    <div className="space-y-6">
      {/* Game Stats */}
      <div className="grid grid-cols-4 gap-3">
        <div className="bg-gradient-to-br from-red-900/50 to-red-800/50 border border-red-500/30 rounded-lg p-4 text-center">
          <p className="text-xs text-red-300 mb-1">Status</p>
          <p className="text-lg font-bold text-red-200">{gameState?.active ? "Active" : "Idle"}</p>
        </div>
        <div className="bg-gradient-to-br from-blue-900/50 to-blue-800/50 border border-blue-500/30 rounded-lg p-4 text-center">
          <p className="text-xs text-blue-300 mb-1">Stake</p>
          <p className="text-lg font-bold text-blue-200">{gameState ? formatEther(gameState.stake) : "0"} STT</p>
        </div>
        <div className="bg-gradient-to-br from-purple-900/50 to-purple-800/50 border border-purple-500/30 rounded-lg p-4 text-center">
          <p className="text-xs text-purple-300 mb-1">Mysteries Solved</p>
          <p className="text-lg font-bold text-purple-200">{gameState?.score || 0}</p>
        </div>
        <div className="bg-gradient-to-br from-green-900/50 to-green-800/50 border border-green-500/30 rounded-lg p-4 text-center">
          <p className="text-xs text-green-300 mb-1">Potential Reward</p>
          <p className="text-lg font-bold text-green-200">{potentialReward} STT</p>
        </div>
      </div>

      {/* Main Game Area */}
      <div className="bg-gradient-to-br from-purple-900/50 to-blue-900/50 border border-purple-500/30 rounded-lg p-8 backdrop-blur-sm">
        {!gameState?.active ? (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-center mb-6">Start Chromatic Mystery</h2>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-purple-200">Stake Amount (STT)</label>
              <input
                type="number"
                value={stakeAmount}
                onChange={(e) => setStakeAmount(e.target.value)}
                step="0.01"
                min="0.01"
                className="w-full bg-slate-900/50 border border-purple-500/30 rounded px-4 py-2 text-white focus:outline-none focus:border-purple-500"
                disabled={isLoading || loading}
              />
            </div>

            <Button
              onClick={handleStartMystery}
              disabled={isLoading || loading || !stakeAmount}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold py-3 rounded-lg"
            >
              {isLoading || loading ? "Starting..." : "Start Mystery"}
            </Button>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-2">Solve the Mystery</h2>
              <p className="text-purple-300">
                Progress: {gameState.sequenceProgress}/{gameState.mysterySequence.length}
              </p>
            </div>

            <div className="grid grid-cols-5 gap-3">
              {COLORS.map((color) => (
                <ColorButton
                  key={color.id}
                  color={color}
                  onClick={() => handleGuessColor(color.id)}
                  disabled={isLoading || loading || result !== null}
                  selected={selectedColor === color.id}
                />
              ))}
            </div>

            {result && (
              <div
                className={`p-4 rounded-lg border ${
                  result.correct
                    ? "bg-green-900/50 border-green-500/50 text-green-200"
                    : "bg-red-900/50 border-red-500/50 text-red-200"
                }`}
              >
                <p className="text-center font-semibold">{result.message}</p>
              </div>
            )}

            <div className="flex gap-3">
              {result?.correct && gameState.active && (
                <Button
                  onClick={() => {
                    setResult(null)
                    setSelectedColor(null)
                  }}
                  className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                >
                  Next Guess
                </Button>
              )}

              {(result || gameState.score > 0) && (
                <Button
                  onClick={handleClaimReward}
                  disabled={isLoading || loading}
                  className="flex-1 bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-700 hover:to-orange-700"
                >
                  Claim Reward
                </Button>
              )}

              {result && (
                <Button
                  onClick={resetGame}
                  className="flex-1 bg-gradient-to-r from-slate-600 to-slate-700 hover:from-slate-700 hover:to-slate-800"
                >
                  New Game
                </Button>
              )}
            </div>
          </div>
        )}
      </div>

      {error && (
        <Alert className="bg-red-900/50 border-red-500/50">
          <AlertDescription className="text-red-200">{error}</AlertDescription>
        </Alert>
      )}

      {onBackToZone && (
        <div className="flex justify-center pt-4">
          <Button
            onClick={onBackToZone}
            variant="outline"
            className="border-purple-500/30 text-purple-300 hover:bg-purple-900/20 bg-transparent"
          >
            Back to Spectra Zone
          </Button>
        </div>
      )}
    </div>
  )
}
