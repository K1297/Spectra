"use client"

interface ColorButtonProps {
  color: { id: number; name: string; hex: string }
  onClick: () => void
  disabled: boolean
  selected: boolean
}

export function ColorButton({ color, onClick, disabled, selected }: ColorButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        relative w-full aspect-square rounded-lg transition-all duration-200
        ${selected ? "ring-2 ring-white scale-110" : ""}
        ${disabled ? "opacity-50 cursor-not-allowed" : "hover:scale-105 cursor-pointer"}
        shadow-lg hover:shadow-xl
      `}
      style={{
        backgroundColor: color.hex,
        boxShadow: selected ? `0 0 20px ${color.hex}` : `0 0 10px ${color.hex}80`,
      }}
      title={color.name}
    >
      <span className="absolute inset-0 flex items-center justify-center text-white font-bold text-xs opacity-0 hover:opacity-100 transition-opacity">
        {color.name}
      </span>
    </button>
  )
}
