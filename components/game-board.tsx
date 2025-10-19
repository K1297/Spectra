"use client"

import { useState, useEffect } from "react"
import { ColorButton } from "@/components/color-button"
import { GameStats } from "@/components/game-stats"
import { GameResult } from "@/components/game-result"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useSpectraContract, type GameState } from "@/hooks/use-spectra-contract"

const COLORS = [
  { id: 1, name: "Red", hex: "#ff4444" },
  { id: 2, name: "Blue", hex: "#4444ff" },
  { id: 3, name: "Green", hex: "#44ff44" },
  { id: 4, name: "Yellow", hex: "#ffff44" },
  { id: 5, name: "Violet", hex: "#ff44ff" },
]

interface GameBoardProps {
  account: string
}

export function GameBoard({ account }: GameBoardProps) {
  const [gameState, setGameState] = useState<GameState | null>(null)
  const [stakeAmount, setStakeAmount] = useState("0.01")
  const [selectedColor, setSelectedColor] = useState<number | null>(null)
  const [result, setResult] = useState<{ survived: boolean; message: string } | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const {
    startGame,
    chooseColor,
    claimReward,
    getGameState,
    getPotentialReward,
    loading,
    error: contractError,
  } = useSpectraContract(account)

  // Fetch game state on mount and periodically
  useEffect(() => {
    const fetchGameState = async () => {
      const state = await getGameState()
      setGameState(state)
    }

    fetchGameState()
    const interval = setInterval(fetchGameState, 5000) // Refresh every 5 seconds

    return () => clearInterval(interval)
  }, [getGameState])

  // Update error from contract
  useEffect(() => {
    if (contractError) {
      setError(contractError)
    }
  }, [contractError])

  const handleStartGame = async () => {
    setError(null)
    setIsLoading(true)
    setResult(null)

    try {
      console.log("[v0] handleStartGame called with stake:", stakeAmount)
      await startGame(stakeAmount)

      await new Promise((resolve) => setTimeout(resolve, 2000))

      const state = await getGameState()
      console.log("[v0] Game state after start:", state)

      if (state?.active) {
        setGameState(state)
      } else {
        setError("Game failed to start. Please try again.")
      }
    } catch (err: any) {
      console.error("[v0] Error in handleStartGame:", err)
      setError(err.message || "Failed to start game. Please check your connection and try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleChooseColor = async (colorId: number) => {
    if (!gameState?.active) return

    setError(null)
    setIsLoading(true)
    setSelectedColor(colorId)

    try {
      await chooseColor(colorId)

      // Wait a moment for blockchain to update
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Fetch updated game state
      const state = await getGameState()
      setGameState(state)

      if (state?.active) {
        // Survived
        const reward = await getPotentialReward()
        setResult({
          survived: true,
          message: `Correct! You chose ${COLORS[colorId - 1].name}. Score: ${state.score}. Potential Reward: ${reward} STT`,
        })
      } else {
        // Lost
        setResult({
          survived: false,
          message: `Wrong! Game Over! Final Score: ${state?.score || 0}`,
        })
      }
    } catch (err: any) {
      setError(err.message || "Failed to choose color")
    } finally {
      setIsLoading(false)
    }
  }

  const handleClaimReward = async () => {
    setError(null)
    setIsLoading(true)

    try {
      await claimReward()

      setResult({
        survived: true,
        message: `Reward claimed successfully!`,
      })

      // Reset game state
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
      <GameStats gameState={gameState} account={account} />

      {/* Main Game Area */}
      <div className="bg-gradient-to-br from-purple-900/50 to-blue-900/50 border border-purple-500/30 rounded-lg p-8 backdrop-blur-sm">
        {!gameState?.active ? (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-center mb-6">Start Your Game</h2>

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
              onClick={handleStartGame}
              disabled={isLoading || loading || !stakeAmount}
              className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-bold py-3 rounded-lg transition-all duration-200"
            >
              {isLoading || loading ? "Starting..." : "Start Game"}
            </Button>
          </div>
        ) : (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-center">Choose a Color</h2>

            <div className="grid grid-cols-5 gap-3">
              {COLORS.map((color) => (
                <ColorButton
                  key={color.id}
                  color={color}
                  onClick={() => handleChooseColor(color.id)}
                  disabled={isLoading || loading || result !== null}
                  selected={selectedColor === color.id}
                />
              ))}
            </div>

            {result && <GameResult result={result} />}

            <div className="flex gap-3">
              {result?.survived && gameState.active && (
                <Button
                  onClick={() => {
                    setResult(null)
                    setSelectedColor(null)
                  }}
                  className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                >
                  Next Round
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
    </div>
  )
}
