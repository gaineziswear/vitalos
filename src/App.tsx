import { useState } from 'react'
import { AppProvider, useApp } from './lib/app-context'
import { I18nCtx, translations } from './lib/i18n'
import { DEMO_ALERTS } from './lib/demo-data'
import { LandingPage } from './components/landing/LandingPage'

// Layout
import { Sidebar } from './components/layout/Sidebar'
import { MobileNav } from './components/layout/MobileNav'
import { TopBar } from './components/layout/TopBar'

// Screens
import { OnboardingScreen } from './components/screens/OnboardingScreen'
import { OverviewScreen } from './components/screens/OverviewScreen'
import { DiscoverScreen } from './components/screens/DiscoverScreen'
import { PortfolioScreen } from './components/screens/PortfolioScreen'
import { OptimiseScreen } from './components/screens/OptimiseScreen'
import { ScenarioScreen } from './components/screens/ScenarioScreen'
import { GuardScreen } from './components/screens/GuardScreen'
import { PassportScreen } from './components/screens/PassportScreen'
import { MandateScreen } from './components/screens/MandateScreen'

function AppShell() {
  const { screen, lang, setLang, onboardingComplete } = useApp()

  if (!onboardingComplete || screen === 'onboarding') {
    return (
      <I18nCtx.Provider value={{ lang, setLang, t: translations[lang] }}>
        <OnboardingScreen />
      </I18nCtx.Provider>
    )
  }

  return (
    <I18nCtx.Provider value={{ lang, setLang, t: translations[lang] }}>
      <div className="min-h-dvh bg-surface-base flex">
        {/* Desktop sidebar */}
        <Sidebar alerts={DEMO_ALERTS} />

        {/* Main content area */}
        <div className="flex-1 flex flex-col min-w-0">
          <TopBar />

          <main id="main-content" className="flex-1 overflow-y-auto">
            {screen === 'overview'   && <OverviewScreen />}
            {screen === 'portfolio'  && <PortfolioScreen />}
            {screen === 'discover'   && <DiscoverScreen />}
            {screen === 'optimise'   && <OptimiseScreen />}
            {screen === 'scenario'   && <ScenarioScreen />}
            {screen === 'guard'      && <GuardScreen />}
            {screen === 'passport'   && <PassportScreen />}
            {screen === 'mandate'    && <MandateScreen />}
            {screen === 'settings'   && <SettingsPlaceholder />}
          </main>
        </div>

        {/* Mobile bottom nav */}
        <MobileNav alerts={DEMO_ALERTS} />
      </div>
    </I18nCtx.Provider>
  )
}

function SettingsPlaceholder() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-12 pb-24">
      <h1 className="font-display text-xl font-bold text-ink-primary mb-2">Settings</h1>
      <p className="text-sm text-ink-secondary">Notification preferences, connected wallets, security settings — coming in the next build phase.</p>
    </div>
  )
}

export default function App() {
  const [showApp, setShowApp] = useState(false)

  if (!showApp) {
    return <LandingPage onLaunchApp={() => setShowApp(true)} />
  }

  return (
    <AppProvider>
      <AppShell />
    </AppProvider>
  )
}
