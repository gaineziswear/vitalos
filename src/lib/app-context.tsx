import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import type { AppMode } from '../types/yieldos'
import type { Lang } from './i18n'
import { useAccount, useConnect, useDisconnect } from 'wagmi'

export type Screen = 'onboarding' | 'overview' | 'portfolio' | 'discover' | 'optimise' | 'scenario' | 'guard' | 'passport' | 'mandate' | 'settings'

interface AppCtx {
  screen: Screen; setScreen: (s: Screen) => void
  mode: AppMode; setMode: (m: AppMode) => void
  lang: Lang; setLang: (l: Lang) => void
  walletConnected: boolean; walletAddress: string
  connectWallet: () => void; disconnectWallet: () => void
  onboardingComplete: boolean; completeOnboarding: (mandate?: { objective?: string; liquidity?: string; risk?: string }) => void
}

const Ctx = createContext<AppCtx | null>(null)

function readStored<T>(key: string, fallback: T): T {
  try {
    const value = window.localStorage.getItem(key)
    return value === null ? fallback : JSON.parse(value) as T
  } catch {
    return fallback
  }
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [screen, setScreen] = useState<Screen>(() => readStored('vitalos.screen', 'onboarding'))
  const [mode, setMode] = useState<AppMode>(() => readStored('vitalos.mode', 'beginner'))
  const [lang, setLang] = useState<Lang>(() => readStored('vitalos.lang', 'en'))
  const [onboardingComplete, setOnboardingComplete] = useState(() => readStored('vitalos.onboardingComplete', false))
  const { address, isConnected } = useAccount()
  const { connect, connectors } = useConnect()
  const { disconnect } = useDisconnect()

  useEffect(() => { window.localStorage.setItem('vitalos.screen', JSON.stringify(screen)) }, [screen])
  useEffect(() => { window.localStorage.setItem('vitalos.mode', JSON.stringify(mode)) }, [mode])
  useEffect(() => { window.localStorage.setItem('vitalos.lang', JSON.stringify(lang)) }, [lang])
  useEffect(() => { window.localStorage.setItem('vitalos.onboardingComplete', JSON.stringify(onboardingComplete)) }, [onboardingComplete])

  function connectWallet() {
    const connector = connectors.find((item) => item.id === 'injected') ?? connectors[0]
    if (connector) void connect({ connector })
  }

  function disconnectWallet() { void disconnect() }

  function completeOnboarding(mandate?: { objective?: string; liquidity?: string; risk?: string }) {
    setOnboardingComplete(true)
    if (mandate) {
      window.localStorage.setItem('vitalos.capitalMandate', JSON.stringify(mandate))
    }
    setScreen('overview')
  }

  return <Ctx.Provider value={{
    screen, setScreen, mode, setMode, lang, setLang,
    walletConnected: isConnected, walletAddress: address ?? '',
    connectWallet, disconnectWallet, onboardingComplete, completeOnboarding,
  }}>{children}</Ctx.Provider>
}

export function useApp(): AppCtx {
  const ctx = useContext(Ctx)
  if (!ctx) throw new Error('useApp must be used within AppProvider')
  return ctx
}
