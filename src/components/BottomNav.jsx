import React from 'react'
import { icons } from './Icons'

const { Home, QrCode, Send, Clock, Cog } = icons

export default function BottomNav({ current, onNavigate }) {
  const items = [
    { key: 'dashboard', label: 'Home', Icon: Home },
    { key: 'send', label: 'Send', Icon: Send },
    { key: 'receive', label: 'QR', Icon: QrCode },
    { key: 'history', label: 'History', Icon: Clock },
    { key: 'settings', label: 'Settings', Icon: Cog },
  ]
  return (
    <div className="absolute bottom-3 left-1/2 -translate-x-1/2 w-[360px] max-w-[92%]">
      <div className="bg-white/8 backdrop-blur-xl border border-white/15 rounded-2xl px-2 py-2 shadow-[0_10px_30px_-10px_rgba(0,0,0,0.7)]">
        <div className="grid grid-cols-5">
          {items.map(({ key, label, Icon }) => {
            const active = current === key
            return (
              <button key={key} onClick={() => onNavigate(key)} className={`flex flex-col items-center justify-center py-2 rounded-xl mx-1 ${active ? 'bg-white/10 ring-1 ring-inset ring-white/15' : ''}`}>
                <Icon className={`size-5 ${active ? 'text-white' : 'text-white/70'}`} />
                <span className={`text-[10px] mt-1 ${active ? 'text-white' : 'text-white/60'}`}>{label}</span>
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
