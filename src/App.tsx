import { lazy, Suspense, useState } from 'react'
import { AppProvider, useApp } from './lib/app-context'
import { I18nCtx, translations } from './lib/i18n'
import { DEMO_ALERTS } from './lib/demo-data'
import { LandingPage } from './components/landing/LandingPage'
import { Sidebar } from './components/layout/Sidebar'
import { MobileNav } from './components/layout/MobileNav'
import { TopBar } from './components/layout/TopBar'

const OnboardingScreen = lazy(() => import('./components/screens/OnboardingScreen').then(m => ({ default: m.OnboardingScreen })))
const OverviewScreen = lazy(() => import('./components/screens/OverviewScreen').then(m => ({ default: m.OverviewScreen })))
const DiscoverScreen = lazy(() => import('./components/screens/DiscoverScreen').then(m => ({ default: m.DiscoverScreen })))
const PortfolioScreen = lazy(() => import('./components/screens/PortfolioScreen').then(m => ({ default: m.PortfolioScreen })))
const OptimiseScreen = lazy(() => import('./components/screens/OptimiseScreen').then(m => ({ default: m.OptimiseScreen })))
const ScenarioScreen = lazy(() => import('./components/screens/ScenarioScreen').then(m => ({ default: m.ScenarioScreen })))
const GuardScreen = lazy(() => import('./components/screens/GuardScreen').then(m => ({ default: m.GuardScreen })))
const PassportScreen = lazy(() => import('./components/screens/PassportScreen').then(m => ({ default: m.PassportScreen })))
const MandateScreen = lazy(() => import('./components/screens/MandateScreen').then(m => ({ default: m.MandateScreen })))
const SettingsScreen = lazy(() => import('./components/screens/SettingsScreen').then(m => ({ default: m.SettingsScreen })))
const BroadcastScreen = lazy(() => import('./components/screens/BroadcastScreen').then(m => ({ default: m.BroadcastScreen })))

function ScreenLoader() {
  return <div className="min-h-[40vh] grid place-items-center" role="status" aria-live="polite"><div className="text-sm text-ink-secondary">Loading VitalOS…</div></div>
}

function AppShell() {
  const { screen, lang, setLang, onboardingComplete } = useApp()
  if (!onboardingComplete || screen === 'onboarding') {
    return <I18nCtx.Provider value={{ lang, setLang, t: translations[lang] }}><Suspense fallback={<ScreenLoader />}><OnboardingScreen /></Suspense></I18nCtx.Provider>
  }
  return (
    <I18nCtx.Provider value={{ lang, setLang, t: translations[lang] }}>
      <div className="min-h-dvh bg-surface-base flex">
        <Sidebar alerts={DEMO_ALERTS} />
        <div className="flex-1 flex flex-col min-w-0">
          <TopBar />
          <main id="main-content" className="flex-1 overflow-y-auto">
            <Suspense fallback={<ScreenLoader />}>
              {screen === 'overview' && <OverviewScreen />}
              {screen === 'portfolio' && <PortfolioScreen />}
              {screen === 'discover' && <DiscoverScreen />}
              {screen === 'optimise' && <OptimiseScreen />}
              {screen === 'scenario' && <ScenarioScreen />}
              {screen === 'guard' && <GuardScreen />}
              {screen === 'passport' && <PassportScreen />}
              {screen === 'mandate' && <MandateScreen />}
              {screen === 'settings' && <SettingsScreen />}
              {screen === 'broadcast' && <BroadcastScreen />}
            </Suspense>
          </main>
        </div>
        <MobileNav alerts={DEMO_ALERTS} />
      </div>
    </I18nCtx.Provider>
  )
}

export default function App() {
  const [showApp, setShowApp] = useState(false)
  if (!showApp) return <LandingPage onLaunchApp={() => setShowApp(true)} />
  return <AppProvider><AppShell /></AppProvider>
}
