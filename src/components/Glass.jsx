import React from 'react'

export function GlassCard({ children, className = '' }) {
  return (
    <div className={`bg-white/8 backdrop-blur-xl border border-white/15 shadow-[0_0_0_1px_rgba(255,255,255,0.06)_inset,0_10px_30px_-10px_rgba(0,0,0,0.6)] rounded-2xl ${className}`}>
      {children}
    </div>
  )
}

export function GlassButton({ children, className = '', onClick, disabled }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`relative w-full select-none active:scale-[0.98] transition-all duration-150 bg-white/6 hover:bg-white/10 disabled:opacity-50 disabled:hover:bg-white/6 backdrop-blur-xl border border-white/15 rounded-xl px-4 py-3 text-white/90 shadow-[0_0_0_1px_rgba(255,255,255,0.06)_inset,0_10px_20px_-10px_rgba(0,0,0,0.7)] ${className}`}
    >
      <span className="absolute inset-0 rounded-xl ring-1 ring-inset ring-white/10" />
      <span className="relative z-10">{children}</span>
    </button>
  )
}

export function GlassBadge({ children, className = '' }) {
  return (
    <div className={`px-2 py-1 rounded-full text-xs bg-white/8 border border-white/15 backdrop-blur-md ${className}`}>
      {children}
    </div>
  )
}

export function GradientBg({ children }) {
  return (
    <div className="min-h-screen w-full" style={{background:"linear-gradient(180deg,#050608,#0b0c0f)"}}>
      {children}
    </div>
  )
}
