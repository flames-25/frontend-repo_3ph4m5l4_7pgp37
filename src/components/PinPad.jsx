import React from 'react'
import { GlassButton } from './Glass'

const keys = [
  ['1','2','3'],
  ['4','5','6'],
  ['7','8','9'],
  ['←','0','✓']
]

export default function PinPad({ onKey }) {
  return (
    <div className="grid grid-cols-3 gap-3 w-full max-w-xs mx-auto">
      {keys.flat().map((k, i) => (
        <GlassButton key={i} onClick={() => onKey(k)} className="py-5 text-lg font-semibold">
          {k}
        </GlassButton>
      ))}
    </div>
  )
}
