import React from 'react'
import { Shield, QrCode, Lock, Key, Wallet, ChevronRight, Eye, EyeOff, Send, Download, Sparkles, Loader2, ArrowUpRight, ArrowDownLeft, Copy, ExternalLink, Home, Settings as Cog, Clock } from 'lucide-react'

export const icons = { Shield, QrCode, Lock, Key, Wallet, ChevronRight, Eye, EyeOff, Send, Download, Sparkles, Loader2, ArrowUpRight, ArrowDownLeft, Copy, ExternalLink, Home, Cog, Clock }

export function Logo({ className = '' }) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className="w-7 h-7 rounded-xl bg-white/10 border border-white/20 shadow-[0_0_0_1px_rgba(255,255,255,0.08)_inset,0_10px_25px_-12px_rgba(0,0,0,0.7)]" />
      <span className="font-[Goldman] tracking-wide text-white">CHEAPPAY</span>
    </div>
  )
}
