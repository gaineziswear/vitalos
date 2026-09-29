import { createContext, useContext, useState, type ReactNode } from 'react'
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
  onboardingComplete: boolean; completeOnboarding: () => void
}

const Ctx = createContext<AppCtx | null>(null)

export function AppProvider({ children }: { children: ReactNode }) {
  const [screen, setScreen] = useState<Screen>('onboarding')
  const [mode, setMode] = useState<AppMode>('beginner')
  const [lang, setLang] = useState<Lang>('en')
  const [onboardingComplete, setOnboardingComplete] = useState(false)
  const { address, isConnected } = useAccount()
  const { connect, connectors } = useConnect()
  const { disconnect } = useDisconnect()

  function connectWallet() {
    const connector = connectors.find((item) => item.id === 'injected') ?? connectors[0]
    if (connector) connect({ connector })
  }

  function disconnectWallet() { disconnect() }

  function completeOnboarding() {
    setOnboardingComplete(true)
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
