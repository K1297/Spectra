"use client"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

interface SpectraZoneProps {
  account: string
  onSelectGame: (gameId: string) => void
  onDisconnect?: () => void
}

export function SpectraZone({ account, onSelectGame, onDisconnect }: SpectraZoneProps) {
  const games = [
    {
      id: "spectrum-survival",
      name: "Spectrum Survival",
      tagline: "Dodge the Spectrum",
      description:
        "Test your luck against the blockchain. Choose the right color and multiply your rewards by 1.2x each round. One wrong choice and it's game over!",
      difficulty: "Medium",
      riskLevel: "High",
      color: "from-red-600 to-orange-600",
      icon: "🎯",
    },
    {
      id: "chromatic-mystery",
      name: "Chromatic Mystery",
      tagline: "Unravel the Color Code",
      description:
        "Solve mysterious color patterns by making strategic selections. Each mystery has a hidden sequence. Crack the code and earn rewards for each correct guess!",
      difficulty: "Hard",
      riskLevel: "Medium",
      color: "from-purple-600 to-pink-600",
      icon: "🔮",
    },
  ]

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center space-y-2">
        <h2 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
          Spectra Zone
        </h2>
        <p className="text-purple-300 text-lg">Choose your challenge and test your skills</p>
        <p className="text-sm text-purple-400">
          Connected: {account.slice(0, 6)}...{account.slice(-4)}
        </p>
      </div>

      {/* Games Grid */}
      <div className="grid md:grid-cols-2 gap-6">
        {games.map((game) => (
          <Card
            key={game.id}
            className="bg-gradient-to-br from-slate-900/80 to-slate-800/80 border-purple-500/30 hover:border-purple-500/60 transition-all duration-300 overflow-hidden group cursor-pointer"
          >
            <div className={`bg-gradient-to-r ${game.color} h-1`} />

            <div className="p-6 space-y-4">
              {/* Icon and Title */}
              <div className="flex items-start justify-between">
                <div>
                  <div className="text-4xl mb-2">{game.icon}</div>
                  <h3 className="text-2xl font-bold text-white">{game.name}</h3>
                  <p className="text-sm text-purple-300 italic">{game.tagline}</p>
                </div>
              </div>

              {/* Description */}
              <p className="text-purple-200 text-sm leading-relaxed">{game.description}</p>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-3 py-3 border-y border-purple-500/20">
                <div className="text-center">
                  <p className="text-xs text-purple-400">Difficulty</p>
                  <p className="text-sm font-semibold text-white">{game.difficulty}</p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-purple-400">Risk Level</p>
                  <p className="text-sm font-semibold text-white">{game.riskLevel}</p>
                </div>
              </div>

              {/* Play Button */}
              <Button
                onClick={() => onSelectGame(game.id)}
                className={`w-full bg-gradient-to-r ${game.color} hover:shadow-lg hover:shadow-purple-500/50 text-white font-bold py-2 rounded-lg transition-all duration-200 group-hover:scale-105`}
              >
                Play Now
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {/* Disconnect Button */}
      <div className="flex justify-center pt-4">
        <Button
          onClick={onDisconnect}
          variant="outline"
          className="border-purple-500/30 text-purple-300 hover:bg-purple-900/20 bg-transparent"
        >
          Disconnect Wallet
        </Button>
      </div>
    </div>
  )
}
