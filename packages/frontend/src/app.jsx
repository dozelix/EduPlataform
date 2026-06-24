import React, { useState, useEffect } from 'react'

import Sidebar from './components/Sidebar'
import Topbar from './components/Topbar'
import TechStack from './components/Techstack'
import StatsGrid from './components/StatsGrid'
import Checklist from './components/Checklist'
import DbTester from './components/DBTester'
import Dashboard from './features/dashboard/dashboard'
import { LoginRegister } from './components/LoginRegister'
import Landing from './features/landing/Landing'

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [currentUser, setCurrentUser] = useState(null)

  // Authenticated app state
  const [dbStatus, setDbStatus] = useState('idle')
  const [result, setResult] = useState('')
  const [activeNav, setActiveNav] = useState('dashboard')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [isElectron] = useState(() => typeof globalThis.window !== 'undefined' && !!globalThis.window.api)

  useEffect(() => {
    if (isElectron) setDbStatus('connected')
  }, [isElectron])

  // ── Landing page (unauthenticated) ──────────────────
  if (!isAuthenticated) {
    return (
      <Landing
        onLoginSuccess={(user) => {
          setCurrentUser(user)
          setIsAuthenticated(true)
        }}
      />
    )
  }

  // ── Authenticated app ───────────────────────────────
  const appUser = currentUser
    ? {
        name: currentUser.name,
        initials: currentUser.name
          .split(' ')
          .map((w) => w[0])
          .join('')
          .slice(0, 2)
          .toUpperCase(),
      }
    : { name: 'Usuario', initials: 'US' }

  const handleNav = (id) => {
    setActiveNav(id)
    setSidebarOpen(false)
  }

  const renderContent = () => {
    switch (activeNav) {
      case 'dashboard':
        return <Dashboard />
      case 'users':
        return (
          <LoginRegister
            onSuccess={(user) => setCurrentUser(user)}
          />
        )
      default:
        return (
          <div className="dashboard">
            <header className="dashboard__header">
              <p className="dashboard__greeting">EduPlatform</p>
              <h1 className="dashboard__title">Sección: {activeNav.toUpperCase()}</h1>
            </header>
            <TechStack />
            <br />
            <StatsGrid />
            <Checklist />
            <DbTester
              isElectron={isElectron}
              dbStatus={dbStatus}
              setDbStatus={setDbStatus}
              result={result}
              setResult={setResult}
            />
          </div>
        )
    }
  }

  return (
    <div className="db-layout">
      <Sidebar
        activeNav={activeNav}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        handleNav={handleNav}
        dbStatus={dbStatus}
      />
      <div className="db-main">
        <Topbar user={appUser} setSidebarOpen={setSidebarOpen} />
        <main className="db-content" id="main">
          {renderContent()}
        </main>
      </div>
    </div>
  )
}

export default App
