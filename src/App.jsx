import React, { useEffect, useState } from 'react'
import PhoneFrame from './components/PhoneFrame'
import { Splash, AccessCode, Welcome, ImportSeed, ImportPK, Dashboard, SendSheet, ReceiveSheet, History, Settings, AddAccount, SwapToken, TopUp } from './components/Screens'
import BottomNav from './components/BottomNav'
import './index.css'

function useIsMobileOnly() {
  const [mobile, setMobile] = useState(window.innerWidth < 768)
  useEffect(() => {
    const onResize = () => setMobile(window.innerWidth < 768)
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])
  return mobile
}

export default function App() {
  const isMobile = useIsMobileOnly()
  const [route, setRoute] = useState('splash')
  const [wallet, setWallet] = useState(null)

  useEffect(() => {
    if (route === 'splash') {
      const t = setTimeout(() => setRoute('lock'), 1800)
      return () => clearTimeout(t)
    }
  }, [route])

  function onUnlocked() { setRoute('welcome') }
  function onImported(w) { setWallet(w); setRoute('dashboard') }

  const showNav = ['dashboard','history','settings','send','receive'].includes(route)

  return (
    <div className="min-h-screen w-full text-white" style={{background:'linear-gradient(180deg,#050608,#101319)'}}>
      {!isMobile ? (
        <div className="min-h-screen flex items-center justify-center p-6">
          <div className="max-w-sm w-full bg-white/8 backdrop-blur-xl border border-white/15 rounded-2xl p-6 text-center">
            <div className="text-lg font-[Goldman] mb-2">Mobile Only</div>
            <div className="text-white/70 text-sm">Open this preview on a narrow window or mobile to experience the wallet UI.</div>
          </div>
        </div>
      ) : (
        <div className="py-6">
          <PhoneFrame>
            {route === 'splash' && <Splash onDone={() => setRoute('lock')} />}
            {route === 'lock' && <AccessCode onUnlock={onUnlocked} />}
            {route === 'welcome' && <Welcome onSelect={(k)=> setRoute(k==='seed'?'seed':'pk')} />}
            {route === 'seed' && <ImportSeed onImported={onImported} />}
            {route === 'pk' && <ImportPK onImported={onImported} />}
            {route === 'dashboard' && wallet && (
              <Dashboard wallet={wallet}
                onSend={() => setRoute('send')}
                onReceive={() => setRoute('receive')}
                onOpenHistory={() => setRoute('history')}
                onOpenSettings={() => setRoute('settings')}
              />
            )}
            {route === 'send' && <SendSheet onClose={() => setRoute('dashboard')} />}
            {route === 'receive' && <ReceiveSheet onClose={() => setRoute('dashboard')} />}
            {route === 'history' && <History onBack={() => setRoute('dashboard')} />}
            {route === 'settings' && (
              <Settings
                onBack={() => setRoute('dashboard')}
                onAddAccount={() => setRoute('add-account')}
                onSwap={() => setRoute('swap')}
                onTopUp={() => setRoute('topup')}
              />
            )}
            {route === 'add-account' && <AddAccount onClose={() => setRoute('settings')} />}
            {route === 'swap' && <SwapToken onClose={() => setRoute('settings')} />}
            {route === 'topup' && <TopUp onClose={() => setRoute('settings')} />}

            {showNav && (
              <BottomNav
                current={route}
                onNavigate={(key) => {
                  if (key === 'send') return setRoute('send')
                  if (key === 'receive') return setRoute('receive')
                  if (key === 'history') return setRoute('history')
                  if (key === 'settings') return setRoute('settings')
                  setRoute('dashboard')
                }}
              />
            )}
          </PhoneFrame>
        </div>
      )}
    </div>
  )
}
