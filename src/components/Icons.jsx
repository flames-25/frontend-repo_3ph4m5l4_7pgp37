import React from 'react'
import { Shield, QrCode, Lock, Key, Wallet, ChevronRight, Eye, EyeOff, Send, Download, Sparkles, Loader2, ArrowUpRight, ArrowDownLeft, Copy, ExternalLink } from 'lucide-react'

export const icons = { Shield, QrCode, Lock, Key, Wallet, ChevronRight, Eye, EyeOff, Send, Download, Sparkles, Loader2, ArrowUpRight, ArrowDownLeft, Copy, ExternalLink }

export function Logo({ className = '' }) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className="w-7 h-7 rounded-xl bg-gradient-to-br from-teal-400 to-fuchsia-500 shadow-lg shadow-teal-500/20" />
      <span className="font-[Goldman] tracking-wide text-white">CHEAPPAY</span>
    </div>
  )
}
