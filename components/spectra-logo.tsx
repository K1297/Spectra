"use client"

export function SpectraLogo() {
  return (
    <div className="relative w-24 h-24 mx-auto">
      <svg viewBox="0 0 100 100" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
        {/* Define gradients */}
        <defs>
          <linearGradient id="prismGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ff4444" stopOpacity="1" />
            <stop offset="25%" stopColor="#ff8844" stopOpacity="1" />
            <stop offset="50%" stopColor="#44ff44" stopOpacity="1" />
            <stop offset="75%" stopColor="#4444ff" stopOpacity="1" />
            <stop offset="100%" stopColor="#ff44ff" stopOpacity="1" />
          </linearGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="2" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Central prism */}
        <polygon points="50,20 80,70 20,70" fill="url(#prismGradient)" filter="url(#glow)" className="animate-pulse" />

        {/* Light beams */}
        <line x1="50" y1="20" x2="50" y2="5" stroke="#ff4444" strokeWidth="2" filter="url(#glow)" />
        <line x1="65" y1="35" x2="80" y2="20" stroke="#ff8844" strokeWidth="2" filter="url(#glow)" />
        <line x1="80" y1="70" x2="95" y2="85" stroke="#44ff44" strokeWidth="2" filter="url(#glow)" />
        <line x1="20" y1="70" x2="5" y2="85" stroke="#4444ff" strokeWidth="2" filter="url(#glow)" />
        <line x1="35" y1="35" x2="20" y2="20" stroke="#ff44ff" strokeWidth="2" filter="url(#glow)" />

        {/* Glow circles at beam ends */}
        <circle cx="50" cy="5" r="3" fill="#ff4444" filter="url(#glow)" />
        <circle cx="80" cy="20" r="3" fill="#ff8844" filter="url(#glow)" />
        <circle cx="95" cy="85" r="3" fill="#44ff44" filter="url(#glow)" />
        <circle cx="5" cy="85" r="3" fill="#4444ff" filter="url(#glow)" />
        <circle cx="20" cy="20" r="3" fill="#ff44ff" filter="url(#glow)" />
      </svg>

      {/* Animated glow effect */}
      <div className="absolute inset-0 rounded-full bg-gradient-to-r from-red-500 via-purple-500 to-blue-500 opacity-20 blur-xl animate-pulse" />
    </div>
  )
}
