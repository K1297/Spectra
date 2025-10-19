"use client"

interface GameResultProps {
  result: { survived: boolean; message: string }
}

export function GameResult({ result }: GameResultProps) {
  return (
    <div
      className={`
        rounded-lg p-4 border-2 text-center font-semibold
        ${
          result.survived
            ? "bg-green-900/50 border-green-500/50 text-green-300"
            : "bg-red-900/50 border-red-500/50 text-red-300"
        }
      `}
    >
      {result.message}
    </div>
  )
}
