import React, { useEffect, useMemo, useState } from 'react'
import Spline from '@splinetool/react-spline'
import { GlassCard, GlassButton, GlassBadge } from './Glass'
import { icons, Logo } from './Icons'
import PinPad from './PinPad'

const { Shield, QrCode, Lock, Key, Wallet, ChevronRight, Eye, EyeOff, Send, Download, Loader2, ArrowUpRight, ArrowDownLeft, Copy, ExternalLink } = icons

function useLocalStorage(key, initial) {
  const [value, setValue] = useState(() => {
    try { const v = localStorage.getItem(key); return v ? JSON.parse(v) : initial } catch { return initial }
  })
  useEffect(() => { try { localStorage.setItem(key, JSON.stringify(value)) } catch {} }, [key, value])
  return [value, setValue]
}

export function Splash({ onDone }) {
  useEffect(() => {
    const t = setTimeout(onDone, 1700)
    return () => clearTimeout(t)
  }, [onDone])
  return (
    <div className="h-full w-full relative">
      <div className="absolute inset-0">
        <Spline scene="https://prod.spline.design/41MGRk-UDPKO-l6W/scene.splinecode" style={{ width:'100%', height:'100%' }} />
      </div>
      <div className="relative h-full w-full flex items-center justify-center p-8">
        <GlassCard className="w-full max-w-xs p-6 text-center space-y-3">
          <Logo className="justify-center" />
          <div className="text-sm text-white/70">Powered by Solana</div>
          <div className="flex items-center justify-center gap-2 text-white/70">
            <Loader2 className="size-4 animate-spin" />
            <span className="text-xs">Loading</span>
          </div>
        </GlassCard>
      </div>
    </div>
  )
}

export function AccessCode({ onUnlock }) {
  const [storedPin, setStoredPin] = useLocalStorage('cheappay_pin', '')
  const [stage, setStage] = useState(storedPin ? 'enter' : 'set')
  const [pin, setPin] = useState('')
  const [firstPin, setFirstPin] = useState('')
  const [error, setError] = useState('')

  function handleKey(k) {
    setError('')
    if (k === '←') { setPin(p => p.slice(0,-1)); return }
    if (k === '✓') {
      if (pin.length !== 6) return
      if (stage === 'enter') {
        if (pin === storedPin) onUnlock()
        else setError('Incorrect code')
      } else if (stage === 'set') {
        setFirstPin(pin); setPin(''); setStage('confirm')
      } else if (stage === 'confirm') {
        if (pin === firstPin) { setStoredPin(pin); onUnlock() }
        else { setError('Codes do not match'); setPin(''); setStage('set') }
      }
      return
    }
    if (/^\d$/.test(k) && pin.length < 6) setPin(p => p + k)
  }

  return (
    <div className="h-full w-full flex flex-col items-center justify-between py-10 px-6">
      <div />
      <div className="w-full max-w-sm space-y-6">
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center gap-2 text-white/80">
            <Lock className="size-5" />
            <div className="text-sm tracking-wide uppercase">{stage === 'enter' ? 'Enter Access Code' : stage === 'set' ? 'Set Access Code' : 'Confirm Code'}</div>
          </div>
          <div className="flex items-center justify-center gap-3">
            {Array.from({length:6}).map((_,i) => (
              <div key={i} className={`w-3 h-3 rounded-full ${i < pin.length ? 'bg-white' : 'bg-white/20'} shadow-[0_0_10px_2px_rgba(255,255,255,0.25)]`} />
            ))}
          </div>
          {error && <div className="text-xs text-white/70">{error}</div>}
        </div>
        <PinPad onKey={handleKey} />
      </div>
      <div className="text-center text-[11px] text-white/40">Biometric lock available in Settings</div>
    </div>
  )
}

export function Welcome({ onSelect }) {
  return (
    <div className="h-full w-full p-6 flex flex-col">
      <div className="flex items-center justify-between">
        <Logo />
        <GlassBadge>v1.0</GlassBadge>
      </div>
      <div className="mt-8">
        <GlassCard className="p-5">
          <div className="text-white/80 text-sm">Secure, fast, and elegant Solana wallet.
          </div>
        </GlassCard>
      </div>
      <div className="mt-auto space-y-3">
        <GlassButton onClick={() => onSelect('seed')}>Import with Seed Phrase</GlassButton>
        <GlassButton onClick={() => onSelect('pk')}>Import with Private Key</GlassButton>
        <GlassButton disabled>Create Wallet (soon)</GlassButton>
      </div>
    </div>
  )
}

export function ImportSeed({ onImported }) {
  const [show, setShow] = useState(false)
  const [phrase, setPhrase] = useState('')
  const valid = phrase.trim().split(/\s+/).length >= 12
  return (
    <div className="h-full w-full p-6 flex flex-col gap-4">
      <GlassCard className="p-3 text-xs text-white/80">Never share your seed phrase</GlassCard>
      <div className="relative">
        <textarea value={phrase} onChange={e=>setPhrase(e.target.value)}
          className="w-full h-40 resize-none bg-white/6 backdrop-blur-xl border border-white/15 rounded-xl p-4 text-white/90 outline-none"
          placeholder="Enter 12/24 words in order" spellCheck="false" />
        <button onClick={()=>setShow(s=>!s)} className="absolute right-4 top-3 text-white/70">
          {show ? <EyeOff className="size-5" /> : <Eye className="size-5" />}
        </button>
        {!show && <div className="absolute inset-0 bg-black/40 rounded-xl pointer-events-none" />}
      </div>
      <GlassButton onClick={()=> valid && onImported({ address:'CHE4...AP', name:'My Wallet' })} disabled={!valid}>Import Wallet</GlassButton>
    </div>
  )
}

export function ImportPK({ onImported }) {
  const [show, setShow] = useState(false)
  const [pk, setPk] = useState('')
  const valid = pk.trim().length > 10
  return (
    <div className="h-full w-full p-6 flex flex-col gap-4">
      <GlassCard className="p-3 text-xs text-white/80">Never share your private key</GlassCard>
      <div className="relative">
        <textarea value={pk} onChange={e=>setPk(e.target.value)}
          className="w-full h-36 resize-none bg-white/6 backdrop-blur-xl border border-white/15 rounded-xl p-4 text-white/90 outline-none"
          placeholder="Paste private key" spellCheck="false" />
        <button onClick={()=>setShow(s=>!s)} className="absolute right-4 top-3 text-white/70">
          {show ? <EyeOff className="size-5" /> : <Eye className="size-5" />}
        </button>
        {!show && <div className="absolute inset-0 bg-black/40 rounded-xl pointer-events-none" />}
      </div>
      <GlassButton onClick={()=> valid && onImported({ address:'CHE4...AP', name:'My Wallet' })} disabled={!valid}>Import Wallet</GlassButton>
    </div>
  )
}

function AssetRow({ logo, name, balance, usd }) {
  return (
    <div className="flex items-center justify-between p-3 rounded-xl bg-white/6 border border-white/10">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-lg bg-white/10" />
        <div>
          <div className="text-white/90">{name}</div>
          <div className="text-xs text-white/50">{usd}</div>
        </div>
      </div>
      <div className="font-[Goldman]">{balance}</div>
    </div>
  )
}

function TopWalletCard({ wallet }) {
  const [hide, setHide] = useLocalStorage('hide_balances', false)
  return (
    <div className="relative rounded-2xl overflow-hidden border border-white/10">
      {/* Neutral glass background */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-white/5 to-white/[0.03] backdrop-blur-xl" />

      <div className="relative p-4">
        <div className="flex items-center justify-between">
          <Logo />
          <div className="flex items-center gap-1.5">
            <GlassBadge className="text-[10px] px-2 py-0.5">Solana</GlassBadge>
            <Shield className="size-4 text-white/80" />
          </div>
        </div>

        {/* Align card number with Total Balance in one row */}
        <div className="mt-3 flex items-center justify-between">
          <div>
            <div className="text-white/70 text-[10px]">{wallet.name}</div>
            <div className="mt-0.5 text-lg font-[Goldman] tracking-wider">CHEA •••• •••• •••• 402</div>
          </div>
          <div className="flex flex-col items-end">
            <div className="text-[10px] text-white/60">Total Balance</div>
            <div className="flex items-center gap-2">
              <div className="text-lg font-[Goldman]">{hide ? '••••••' : '$1,068.40'}</div>
              <button onClick={()=>setHide(h=>!h)} className="text-white/70 active:scale-95">
                {hide ? <Eye className="size-4" /> : <EyeOff className="size-4" />}
              </button>
            </div>
          </div>
        </div>

        <div className="mt-3 grid grid-cols-3 gap-2">
          <GlassCard className="p-2 text-center bg-white/5">
            <div className="text-[10px] text-white/60">SOL</div>
            <div className="text-sm font-[Goldman]">{hide ? '•••' : '2.84'}</div>
          </GlassCard>
          <GlassCard className="p-2 text-center bg-white/5">
            <div className="text-[10px] text-white/60">USDC</div>
            <div className="text-sm font-[Goldman]">{hide ? '•••' : '128.2'}</div>
          </GlassCard>
          <GlassCard className="p-2 text-center bg-white/5">
            <div className="text-[10px] text-white/60">CHEAP</div>
            <div className="text-sm font-[Goldman]">{hide ? '•••' : '42,000'}</div>
          </GlassCard>
        </div>

        <div className="mt-3 flex items-center justify-between text-[11px]">
          <div className="flex items-center gap-1.5">
            <div className="px-2 py-1 rounded-lg bg-white/8 border border-white/15 font-[Goldman]">CHE4...AP</div>
            <button className="px-2 py-1 rounded-lg bg-white/8 border border-white/15 text-white/70 active:scale-95">
              <Copy className="size-3" />
            </button>
          </div>
          <a href="https://solscan.io/" target="_blank" rel="noreferrer" className="flex items-center gap-1 text-white/80 hover:underline">
            <span>SOLSCAN</span>
            <ExternalLink className="size-3" />
          </a>
        </div>
      </div>
    </div>
  )
}

export function Dashboard({ wallet, onSend, onReceive, onOpenHistory, onOpenSettings }) {
  return (
    <div className="h-full w-full p-5 pb-20 flex flex-col gap-3">
      <TopWalletCard wallet={wallet} />

      <div className="grid grid-cols-2 gap-2.5">
        <GlassButton onClick={onSend}><Send className="inline mr-2" size={16}/>Send</GlassButton>
        <GlassButton onClick={onReceive}><QrCode className="inline mr-2" size={16}/>Receive</GlassButton>
      </div>

      <div className="mt-1.5">
        <div className="text-white/70 mb-2">My Assets</div>
        <div className="space-y-2">
          <AssetRow name="Solana" balance="2.84" usd="$520" />
          <AssetRow name="USDC" balance="128.20" usd="$128.20" />
          <AssetRow name="CHEAP" balance="42,000" usd="$420" />
        </div>
      </div>

      <div className="mt-auto grid grid-cols-2 gap-2 text-xs text-white/50">
        <GlassButton onClick={onOpenHistory}>History</GlassButton>
        <GlassButton onClick={onOpenSettings}>Settings</GlassButton>
      </div>
    </div>
  )
}

export function SendSheet({ onClose }) {
  const [to, setTo] = useState('')
  const [amt, setAmt] = useState('')
  const fee = useMemo(()=> amt ? Math.max(0.00001, Number(amt)*0.0005).toFixed(5) : '0.00000', [amt])
  return (
    <div className="p-5 space-y-3 pb-24">
      <div className="text-white/80">Send</div>
      <input value={to} onChange={e=>setTo(e.target.value)} placeholder="Recipient address" className="w-full bg-white/6 border border-white/15 rounded-xl p-3 text-white/90 outline-none" />
      <input value={amt} onChange={e=>setAmt(e.target.value)} placeholder="Amount (SOL)" className="w-full bg-white/6 border border-white/15 rounded-xl p-3 text-white/90 outline-none" />
      <GlassCard className="p-3 text-xs text-white/60">Network fee estimate: <span className="text-white">{fee} SOL</span></GlassCard>
      <div className="grid grid-cols-2 gap-3">
        <GlassButton onClick={onClose}>Cancel</GlassButton>
        <GlassButton onClick={onClose}>Send</GlassButton>
      </div>
    </div>
  )
}

export function ReceiveSheet({ onClose }) {
  return (
    <div className="p-5 space-y-3 pb-24">
      <div className="text-white/80">Receive</div>
      <div className="aspect-square rounded-xl bg-white/6 border border-white/10" />
      <div className="flex items-center justify-between bg-white/6 border border-white/15 rounded-xl p-3">
        <div className="text-xs text-white/60">Your address</div>
        <div className="font-[Goldman]">CHE4...AP</div>
      </div>
      <GlassButton onClick={onClose}>Close</GlassButton>
    </div>
  )
}

export function History({ onBack }) {
  const tabs = ['All','Received','Sent']
  const [tab, setTab] = useState('All')
  const rows = [
    { dir:'in', amt:'+1.24 SOL', addr:'8x9...jk2', time:'2m', status:'confirmed' },
    { dir:'out', amt:'-0.42 SOL', addr:'9dd...we1', time:'1h', status:'confirmed' },
    { dir:'in', amt:'+120 USDC', addr:'2aa...ff3', time:'2d', status:'confirmed' },
  ]
  const filtered = rows.filter(r => tab==='All' || (tab==='Received' ? r.dir==='in' : r.dir==='out'))
  return (
    <div className="h-full w-full p-5 pb-24 flex flex-col gap-4">
      <div className="grid grid-cols-3 bg-white/6 border border-white/10 rounded-xl p-1">
        {tabs.map(t => (
          <button key={t} onClick={()=>setTab(t)} className={`py-2 rounded-lg text-sm ${tab===t?'bg-white/15 ring-1 ring-inset ring-white/20 text-white':'text-white/60'}`}>{t}</button>
        ))}
      </div>
      <div className="space-y-2">
        {filtered.map((r,i)=>(
          <GlassCard key={i} className="p-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              {r.dir==='in'? <ArrowDownLeft className="text-white/80" /> : <ArrowUpRight className="text-white/80" />}
              <div>
                <div className="text-white/90">{r.amt}</div>
                <div className="text-xs text-white/50">{r.dir==='in'?'From':'To'} {r.addr}</div>
              </div>
            </div>
            <div className="text-xs text-white/50">{r.time}</div>
          </GlassCard>
        ))}
      </div>
      <div className="mt-auto">
        <GlassButton onClick={onBack}>Back</GlassButton>
      </div>
    </div>
  )
}

export function Settings({ onBack, onAddAccount, onSwap, onTopUp, onNFC }) {
  const [hide, setHide] = useLocalStorage('hide_balances', false)
  return (
    <div className="h-full w-full p-5 pb-24 flex flex-col gap-3">
      <GlassCard className="p-4">
        <div className="text-white/80 mb-2">Accounts</div>
        <div className="grid gap-2">
          <GlassButton onClick={onAddAccount}>Add Account</GlassButton>
          <GlassButton onClick={onSwap}>Swap Token</GlassButton>
          <GlassButton onClick={onTopUp}>Top Up</GlassButton>
          <GlassButton onClick={onNFC}>NFC Transfer</GlassButton>
        </div>
      </GlassCard>
      <GlassCard className="p-4">
        <div className="text-white/80 mb-2">Security</div>
        <div className="grid gap-2">
          <GlassButton>Change Access Code</GlassButton>
          <GlassButton>Enable Biometric (mock)</GlassButton>
          <GlassButton onClick={()=>setHide(h=>!h)}>{hide? 'Show balances':'Hide balances'}</GlassButton>
          <GlassButton>Show QR Address</GlassButton>
          <GlassButton>Export Public Key</GlassButton>
          <GlassButton className="text-white border-white/30">Remove Wallet</GlassButton>
        </div>
      </GlassCard>
      <div className="mt-auto">
        <GlassButton onClick={onBack}>Back</GlassButton>
      </div>
    </div>
  )
}

export function AddAccount({ onClose }) {
  const [name, setName] = useState('')
  return (
    <div className="p-5 space-y-3 pb-24">
      <div className="text-white/80">Add Account</div>
      <input value={name} onChange={e=>setName(e.target.value)} placeholder="Account name" className="w-full bg-white/6 border border-white/15 rounded-xl p-3 text-white/90 outline-none" />
      <GlassButton onClick={onClose} disabled={!name.trim()}>Create (mock)</GlassButton>
      <GlassButton onClick={onClose}>Cancel</GlassButton>
    </div>
  )
}

export function SwapToken({ onClose }) {
  const [from, setFrom] = useState('SOL')
  const [to, setTo] = useState('USDC')
  const [amt, setAmt] = useState('')
  return (
    <div className="p-5 space-y-3 pb-24">
      <div className="text-white/80">Swap Token</div>
      <select value={from} onChange={e=>setFrom(e.target.value)} className="w-full bg-white/6 border border-white/15 rounded-xl p-3 text-white/90 outline-none">
        <option>SOL</option>
        <option>USDC</option>
        <option>CHEAP</option>
      </select>
      <select value={to} onChange={e=>setTo(e.target.value)} className="w-full bg-white/6 border border-white/15 rounded-xl p-3 text-white/90 outline-none">
        <option>USDC</option>
        <option>SOL</option>
        <option>CHEAP</option>
      </select>
      <input value={amt} onChange={e=>setAmt(e.target.value)} placeholder="Amount" className="w-full bg-white/6 border border-white/15 rounded-xl p-3 text-white/90 outline-none" />
      <GlassButton onClick={onClose} disabled={!amt}>Swap (mock)</GlassButton>
      <GlassButton onClick={onClose}>Cancel</GlassButton>
    </div>
  )
}

export function TopUp({ onClose }) {
  const [amt, setAmt] = useState('')
  return (
    <div className="p-5 space-y-3 pb-24">
      <div className="text-white/80">Top Up</div>
      <input value={amt} onChange={e=>setAmt(e.target.value)} placeholder="Amount (USDC)" className="w-full bg-white/6 border border-white/15 rounded-xl p-3 text-white/90 outline-none" />
      <GlassCard className="p-3 text-xs text-white/60">Payment methods coming soon</GlassCard>
      <GlassButton onClick={onClose} disabled={!amt}>Proceed (mock)</GlassButton>
      <GlassButton onClick={onClose}>Cancel</GlassButton>
    </div>
  )
}

function NFCWaves({ label = 'Mencari perangkat terdekat...' }) {
  return (
    <div className="relative mx-auto mt-2 mb-1 h-40 w-40">
      <div className="absolute inset-0 rounded-full border border-white/15" />
      <div className="absolute inset-0 rounded-full animate-ping border border-white/20" />
      <div className="absolute inset-2 rounded-full animate-ping border border-white/15" style={{ animationDelay: '150ms' }} />
      <div className="absolute inset-4 rounded-full animate-ping border border-white/10" style={{ animationDelay: '300ms' }} />
      <div className="absolute inset-1/3 rounded-full bg-white/10 backdrop-blur-xl border border-white/20 flex items-center justify-center">
        <div className="h-3 w-3 rounded-full bg-white shadow-[0_0_20px_6px_rgba(255,255,255,0.25)]" />
      </div>
      <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-[11px] text-white/70 whitespace-nowrap">{label}</div>
    </div>
  )
}

export function NFCTransfer({ onClose }) {
  const [mode, setMode] = useState('send') // 'send' | 'receive'
  const [amt, setAmt] = useState('')
  const [addr, setAddr] = useState('')
  const [status, setStatus] = useState('')
  const [error, setError] = useState('')
  const [scanning, setScanning] = useState(false)
  const hasNFC = typeof window !== 'undefined' && 'NDEFReader' in window

  async function startSend() {
    setError(''); setStatus('');
    if (!amt || !addr) { setError('Isi nominal dan alamat terlebih dulu'); return }
    setScanning(true)
    if (!hasNFC) {
      setStatus('Mencari perangkat terdekat (simulasi)...')
      setTimeout(()=> setStatus('Tempelkan perangkat penerima untuk mengirim...'), 1000)
      setTimeout(()=> { setStatus('Permintaan pembayaran terkirim (simulasi)'); setScanning(false) }, 2200)
      return
    }
    try {
      const ndef = new window.NDEFReader()
      await ndef.write({ records: [ { recordType:'text', data: JSON.stringify({ type:'cheappay:payment', addr, amt }) } ] })
      setStatus('Permintaan pembayaran terkirim via NFC. Minta penerima untuk tap.')
    } catch (e) {
      setError(e?.message || 'NFC write failed')
    } finally {
      setScanning(false)
    }
  }

  async function startListen() {
    setError(''); setStatus('');
    setScanning(true)
    if (!hasNFC) {
      setStatus('Mendengarkan NFC (simulasi)...')
      setTimeout(()=> {
        setStatus('Payload NFC contoh diterima. Siap diproses.')
        setAmt('0.25'); setAddr('8x9...jk2'); setScanning(false)
      }, 1600)
      return
    }
    try {
      const ndef = new window.NDEFReader()
      await ndef.scan()
      setStatus('Mendengarkan... dekatkan perangkat untuk tap.')
      ndef.onreading = (event) => {
        try {
          const rec = event.message.records?.[0]
          if (rec?.recordType === 'text') {
            const textDecoder = new TextDecoder()
            const payload = JSON.parse(textDecoder.decode(rec.data))
            if (payload?.type === 'cheappay:payment') {
              setAmt(String(payload.amt || '')); setAddr(payload.addr || '');
              setStatus('Permintaan pembayaran diterima. Anda bisa konfirmasi di layar Send.')
              setScanning(false)
            } else {
              setStatus('Payload NFC tidak dikenal')
            }
          } else {
            setStatus('Tipe record NFC tidak didukung')
          }
        } catch (err) {
          setError('Gagal membaca data NFC')
          setScanning(false)
        }
      }
    } catch (e) {
      setError(e?.message || 'NFC scan failed')
      setScanning(false)
    }
  }

  return (
    <div className="p-5 space-y-3 pb-24">
      <div className="text-white/80">NFC Transfer</div>
      <GlassCard className="p-3 text-xs text-white/60">
        Berjalan di perangkat Android Chrome yang mendukung melalui HTTPS. Jika NFC tidak tersedia, proses akan disimulasikan.
      </GlassCard>
      <div className="grid grid-cols-2 bg-white/6 border border-white/10 rounded-xl p-1">
        {['send','receive'].map(m => (
          <button key={m} onClick={()=>setMode(m)} className={`py-2 rounded-lg text-sm ${mode===m?'bg-white/15 ring-1 ring-inset ring-white/20 text-white':'text-white/60'}`}>{m==='send'?'Kirim via NFC':'Terima via NFC'}</button>
        ))}
      </div>

      {scanning && (
        <GlassCard className="p-6 flex flex-col items-center">
          <NFCWaves label={mode==='send' ? 'Mencari perangkat untuk mengirim...' : 'Mencari perangkat di sekitar...'} />
          <div className="mt-10 text-[11px] text-white/60">Pastikan NFC aktif dan perangkat dalam jarak dekat</div>
        </GlassCard>
      )}

      {mode==='send' ? (
        <>
          <input value={addr} onChange={e=>setAddr(e.target.value)} placeholder="Recipient address" className="w-full bg-white/6 border border-white/15 rounded-xl p-3 text-white/90 outline-none" />
          <input value={amt} onChange={e=>setAmt(e.target.value)} placeholder="Amount (SOL)" className="w-full bg-white/6 border border-white/15 rounded-xl p-3 text-white/90 outline-none" />
          <GlassButton onClick={startSend} disabled={scanning}>{scanning ? 'Menunggu...' : 'Mulai NFC'}</GlassButton>
        </>
      ) : (
        <>
          <GlassButton onClick={startListen} disabled={scanning}>{scanning ? 'Mendengarkan...' : 'Dengarkan NFC'}</GlassButton>
          {(addr || amt) && !scanning ? (
            <GlassCard className="p-3 text-xs text-white/70">
              Permintaan masuk: {amt || '—'} SOL ke {addr || '—'}
            </GlassCard>
          ) : null}
        </>
      )}

      {status && <div className="text-xs text-white/70">{status}</div>}
      {error && <div className="text-xs text-red-300">{error}</div>}

      <GlassButton onClick={onClose}>Close</GlassButton>
    </div>
  )
}
