import React from 'react'

export default function PhoneFrame({ children }) {
  return (
    <div className="mx-auto h-[844px] w-[390px] rounded-[42px] border border-white/10 shadow-2xl overflow-hidden relative" style={{background:"linear-gradient(180deg,#050608,#0a0c10)"}}>
      <div className="absolute inset-0 pointer-events-none" style={{background:"radial-gradient(800px_400px_at_50%_-20%,rgba(165,243,252,0.08),transparent), radial-gradient(600px_300px_at_120%_10%,rgba(192,132,252,0.06),transparent)"}} />
      <div className="relative h-full w-full">{children}</div>
    </div>
  )
}
