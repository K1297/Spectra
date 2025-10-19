"use client"

interface GameState {
  active: boolean
  stake: string
  score: number
  potentialReward: string
}

interface GameStatsProps {
  gameState: GameState | null
  account: string
}

export function GameStats({ gameState, account }: GameStatsProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <div className="bg-gradient-to-br from-red-900/50 to-red-800/50 border border-red-500/30 rounded-lg p-4 backdrop-blur-sm">
        <p className="text-red-300 text-sm font-medium">Status</p>
        <p className="text-2xl font-bold text-red-400 mt-1">{gameState?.active ? "Active" : "Idle"}</p>
      </div>

      <div className="bg-gradient-to-br from-blue-900/50 to-blue-800/50 border border-blue-500/30 rounded-lg p-4 backdrop-blur-sm">
        <p className="text-blue-300 text-sm font-medium">Stake</p>
        <p className="text-2xl font-bold text-blue-400 mt-1">{gameState?.stake} STT</p>
      </div>

      <div className="bg-gradient-to-br from-purple-900/50 to-purple-800/50 border border-purple-500/30 rounded-lg p-4 backdrop-blur-sm">
        <p className="text-purple-300 text-sm font-medium">Score</p>
        <p className="text-2xl font-bold text-purple-400 mt-1">{gameState?.score}</p>
      </div>

      <div className="bg-gradient-to-br from-green-900/50 to-green-800/50 border border-green-500/30 rounded-lg p-4 backdrop-blur-sm">
        <p className="text-green-300 text-sm font-medium">Potential Reward</p>
        <p className="text-2xl font-bold text-green-400 mt-1">{gameState?.potentialReward} STT</p>
      </div>

      <div className="col-span-2 md:col-span-4 bg-gradient-to-br from-slate-900/50 to-slate-800/50 border border-slate-500/30 rounded-lg p-4 backdrop-blur-sm">
        <p className="text-slate-300 text-sm font-medium">Connected Account</p>
        <p className="text-sm font-mono text-slate-400 mt-1 break-all">{account}</p>
      </div>
    </div>
  )
}
